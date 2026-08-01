<?php
require_once 'session_config.php';

$allowed_origins = [
    'http://localhost:3000',
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    header('HTTP/1.1 403 Forbidden');
    exit;
}

header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (! isset($input['business_hours']) || ! is_array($input['business_hours'])) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid input data']);
    exit;
}

try {

    $pdo = new PDO('mysql:host=localhost;dbname=loveday_auto', 'root', '', [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ]);

    $pdo->beginTransaction();

    $sql = 'INSERT INTO business_hours (day_of_week, open_time, close_time, created_at, updated_at)
            VALUES (:day_of_week, :open_time, :close_time, NOW(), NOW())
            ON DUPLICATE KEY UPDATE
                open_time = VALUES(open_time),
                close_time = VALUES(close_time),
                updated_at = NOW()';

    $stmt = $pdo->prepare($sql);

    foreach ($input['business_hours'] as $entry) {
        $stmt->execute([
            ':day_of_week' => (int) $entry['day_of_week'],
            ':open_time'   => $entry['open_time'],
            ':close_time'  => $entry['close_time'],
        ]);
    }

    $pdo->commit();
    echo json_encode(['status' => 'success', 'message' => 'Business hours saved successfully.']);

} catch (PDOException $e) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    file_put_contents('error_log.txt', $e->getMessage() . PHP_EOL, FILE_APPEND);
    echo json_encode(['status' => 'error', 'message' => 'Failed to save business hours.']);
} finally {
    $pdo = null;
}
