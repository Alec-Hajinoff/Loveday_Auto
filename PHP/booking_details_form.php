<?php
require_once 'session_config.php';

$allowed_origins = [
    'http://localhost:3000',
    'https://lovedayauto.co.uk',
    'https://www.lovedayauto.co.uk',
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? null;

if ($origin !== null && in_array($origin, $allowed_origins, true)) {
    header("Access-Control-Allow-Origin: $origin");
} elseif ($origin === null) {

    // Allow same-origin and direct requests.

} else {
    header('HTTP/1.1 403 Forbidden');
    exit;
}

header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

if (! isset($_SESSION['id'])) {
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized access. Please log in.']);
    exit;
}

$user_id   = $_SESSION['id'];
$user_role = $_SESSION['role'] ?? 'customer';

if ($user_role !== 'customer') {
    echo json_encode(['status' => 'error', 'message' => 'Access denied. Only customers can access the booking form.']);
    exit;
}

try {

    $servername     = 'localhost:3306';
    $username       = 'loveday_auto_user';
    $passwordServer = 'EYx7ejJMiPEcSqH';
    $dbname         = 'loveday_auto';

    $pdo = new PDO("mysql:host=$servername;dbname=$dbname", $username, $passwordServer, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ]);

    $stmt     = $pdo->query('SELECT id, name, duration_minutes FROM services ORDER BY name ASC');
    $services = $stmt->fetchAll();

    $user_stmt = $pdo->prepare('SELECT first_name, surname, phone FROM users WHERE id = :user_id');
    $user_stmt->execute([':user_id' => $user_id]);
    $user_data = $user_stmt->fetch();

    echo json_encode([
        'status'   => 'success',
        'services' => $services,
        'user'     => $user_data ?: [
            'first_name' => '',
            'surname'    => '',
            'phone'      => '',
        ],
    ]);

} catch (PDOException $e) {
    file_put_contents('error_log.txt', $e->getMessage() . PHP_EOL, FILE_APPEND);
    echo json_encode(['status' => 'error', 'message' => 'Failed to load available services']);
} finally {
    $pdo = null;
}
