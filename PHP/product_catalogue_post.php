<?php
require_once 'session_config.php';

$config = parse_ini_file(__DIR__ . '/../.env', false, INI_SCANNER_RAW);
if ($config === false) {
    error_log('Failed to parse .env file');
    echo json_encode(['status' => 'error', 'message' => 'Server configuration error']);
    exit;
}

$stripe_secret_key = $config['STRIPE_SECRET_KEY'] ?? '';

if (empty($stripe_secret_key)) {
    error_log('Stripe API credentials not found in .env file');
    echo json_encode(['status' => 'error', 'message' => 'Server configuration error']);
    exit;
}

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

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

$stripe_price_id = trim($input['stripe_price_id'] ?? '');
$quantity        = filter_var($input['quantity'] ?? 1, FILTER_VALIDATE_INT);

if (empty($stripe_price_id) || $quantity === false || $quantity < 1) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid product price ID or quantity provided.']);
    exit;
}

$checkout_data = [
    'line_items'  => [
        [
            'price'    => $stripe_price_id,
            'quantity' => $quantity,
        ],
    ],
    'mode'        => 'payment',
    'success_url' => 'https://impulsive-spirits-overpay.ngrok-free.dev/Loveday_Auto/PHP/success_redirect.php',
    'cancel_url'  => 'https://impulsive-spirits-overpay.ngrok-free.dev/Loveday_Auto/PHP/cancel_redirect.php',
    'ui_mode'     => 'hosted_page',
];

$ch = curl_init('https://api.stripe.com/v1/checkout/sessions');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_USERPWD, $stripe_secret_key . ':');
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($checkout_data));

$stripe_response = curl_exec($ch);
$http_code       = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if (curl_errno($ch) || $http_code !== 200) {
    $error_msg = curl_error($ch);
    curl_close($ch);
    file_put_contents('error_log.txt', "Stripe Checkout Error ($http_code): " . $error_msg . PHP_EOL . $stripe_response . PHP_EOL, FILE_APPEND);
    echo json_encode(['status' => 'error', 'message' => 'Failed to create Stripe Checkout Session.']);
    exit;
}

curl_close($ch);

$session_data = json_decode($stripe_response, true);
$checkout_url = $session_data['url'] ?? null;

if ($checkout_url) {
    echo json_encode([
        'status' => 'success',
        'url'    => $checkout_url,
    ]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Stripe did not return a valid checkout URL.']);
}
