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
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

if (! isset($_SESSION['id'])) {
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized access. Please log in.']);
    exit;
}

$user_id   = $_SESSION['id'];
$user_role = $_SESSION['role'] ?? 'customer';

if ($user_role !== 'customer') {
    echo json_encode(['status' => 'error', 'message' => 'Access denied.']);
    exit;
}

$input          = json_decode(file_get_contents('php://input'), true);
$appointment_id = $input['appointment_id'] ?? null;

if (! $appointment_id) {
    echo json_encode(['status' => 'error', 'message' => 'Appointment ID is required.']);
    exit;
}

try {
    $pdo = new PDO('mysql:host=127.0.0.1;dbname=loveday_auto', 'root', '', [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ]);

    $pdo->beginTransaction();

    $stmt = $pdo->prepare('SELECT id, slot_id FROM appointments WHERE id = :id AND user_id = :user_id');
    $stmt->execute([
        ':id'      => $appointment_id,
        ':user_id' => $user_id,
    ]);
    $appointment = $stmt->fetch();

    if (! $appointment) {
        $pdo->rollBack();
        echo json_encode(['status' => 'error', 'message' => 'Booking not found or access denied.']);
        exit;
    }

    $slot_id = $appointment['slot_id'];

    $deleteStmt = $pdo->prepare('DELETE FROM appointments WHERE id = :id');
    $deleteStmt->execute([':id' => $appointment_id]);

    $updateStmt = $pdo->prepare('UPDATE availability_slots SET is_available = 1, updated_at = NOW() WHERE id = :slot_id');
    $updateStmt->execute([':slot_id' => $slot_id]);

    $pdo->commit();

    echo json_encode([
        'status'  => 'success',
        'message' => 'Booking cancelled and slot released successfully.',
    ]);

} catch (PDOException $e) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    file_put_contents('error_log.txt', $e->getMessage() . PHP_EOL, FILE_APPEND);
    echo json_encode(['status' => 'error', 'message' => 'Failed to cancel the booking.']);
} finally {
    $pdo = null;
}
