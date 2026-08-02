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
    echo json_encode(['status' => 'error', 'message' => 'You must be logged in to book an appointment.']);
    exit;
}

$user_id   = $_SESSION['id'];
$user_role = $_SESSION['role'] ?? 'customer';

if ($user_role !== 'customer') {
    echo json_encode(['status' => 'error', 'message' => 'Access denied. Only customers can book appointments.']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (! isset($input['slot_ids']) || ! is_array($input['slot_ids']) || empty($input['slot_ids'])) {
    echo json_encode(['status' => 'error', 'message' => 'Please select at least one appointment slot.']);
    exit;
}

$slot_ids    = array_map('intval', $input['slot_ids']);
$service_id  = isset($input['service_id']) ? (int) $input['service_id'] : null;
$vehicle_reg = isset($input['vehicle_reg']) ? trim($input['vehicle_reg']) : null;
$notes       = isset($input['notes']) ? trim($input['notes']) : null;

$first_name = isset($input['first_name']) ? trim($input['first_name']) : '';
$surname    = isset($input['surname']) ? trim($input['surname']) : '';
$phone      = isset($input['phone']) ? trim($input['phone']) : '';

if (empty($vehicle_reg)) {
    echo json_encode(['status' => 'error', 'message' => 'Vehicle registration is required.']);
    exit;
}

if (empty($first_name) || empty($surname) || empty($phone)) {
    echo json_encode(['status' => 'error', 'message' => 'First name, surname, and phone number are required.']);
    exit;
}

try {
    $pdo = new PDO('mysql:host=localhost;dbname=loveday_auto', 'root', '', [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ]);

    $pdo->beginTransaction();

    $user_stmt = $pdo->prepare('
        UPDATE users
        SET first_name = :first_name,
            surname = :surname,
            phone = :phone,
            updated_at = NOW()
        WHERE id = :user_id
    ');
    $user_stmt->execute([
        ':first_name' => $first_name,
        ':surname'    => $surname,
        ':phone'      => $phone,
        ':user_id'    => $user_id,
    ]);

    $in_clause  = implode(',', array_fill(0, count($slot_ids), '?'));
    $check_stmt = $pdo->prepare("SELECT id FROM availability_slots WHERE id IN ($in_clause) AND is_available = 1 FOR UPDATE");
    $check_stmt->execute($slot_ids);
    $available_slots = $check_stmt->fetchAll();

    if (count($available_slots) !== count($slot_ids)) {
        $pdo->rollBack();
        echo json_encode(['status' => 'error', 'message' => 'One or more selected slots are no longer available.']);
        exit;
    }

    $update_stmt = $pdo->prepare("UPDATE availability_slots SET is_available = 0, updated_at = NOW() WHERE id IN ($in_clause)");
    $update_stmt->execute($slot_ids);

    $app_stmt = $pdo->prepare('
        INSERT INTO appointments (user_id, slot_id, service_id, vehicle_reg, notes, created_at, updated_at)
        VALUES (:user_id, :slot_id, :service_id, :vehicle_reg, :notes, NOW(), NOW())
    ');

    foreach ($slot_ids as $slot_id) {
        $app_stmt->execute([
            ':user_id'     => $user_id,
            ':slot_id'     => $slot_id,
            ':service_id'  => $service_id,
            ':vehicle_reg' => $vehicle_reg,
            ':notes'       => $notes,
        ]);
    }

    $pdo->commit();
    echo json_encode(['status' => 'success', 'message' => 'Appointment booked successfully!']);

} catch (PDOException $e) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    file_put_contents('error_log.txt', $e->getMessage() . PHP_EOL, FILE_APPEND);
    echo json_encode(['status' => 'error', 'message' => 'Failed to process appointment booking.']);
} finally {
    $pdo = null;
}
