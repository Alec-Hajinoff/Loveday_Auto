<?php
// PHP\product_catalogue_post.php

// 1. CORS Headers
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Handle OPTIONS preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 2. Align Session Name & Cookie Parameters
if (session_status() === PHP_SESSION_NONE) {
    session_set_cookie_params([
        'lifetime' => 86400,
        'path'     => '/',
        'secure'   => false,
        'httponly' => true,
        'samesite' => 'Lax'
    ]);

    session_name('PHPSESSID');
    session_start();
}

// 3. Verify Session Authorization
if (!isset($_SESSION['id'])) {
    http_response_code(401);
    echo json_encode([
        'status'  => 'error',
        'message' => 'Unauthorized. Please log in to complete checkout.'
    ]);
    exit();
}

$user_id = $_SESSION['id'];

// 4. Load Environment Variables (.env) from Project Root
$envPath = __DIR__ . '/../.env';

if (file_exists($envPath)) {
    $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        if (empty($line) || strpos($line, '#') === 0) continue;
        if (strpos($line, '=') !== false) {
            list($name, $value) = explode('=', $line, 2);
            $name = trim($name);
            $value = trim($value, " \t\n\r\0\x0B\"'");
            $_ENV[$name] = $value;
            putenv("{$name}={$value}");
        }
    }
}

$stripe_secret_key = $_ENV['STRIPE_SECRET_KEY'] ?? getenv('STRIPE_SECRET_KEY') ?? $_SERVER['STRIPE_SECRET_KEY'] ?? null;

if (!$stripe_secret_key) {
    http_response_code(500);
    echo json_encode([
        'status'  => 'error',
        'message' => 'Stripe secret key is not configured on the server.',
        'debug'   => [
            'checked_path' => realpath($envPath) ?: $envPath,
            'file_exists'  => file_exists($envPath)
        ]
    ]);
    exit();
}

// 5. Read Raw JSON Payload
$input = json_decode(file_get_contents('php://input'), true);

$line_items = [];

// Handle multi-item basket array or single-item payload
if (isset($input['items']) && is_array($input['items']) && count($input['items']) > 0) {
    foreach ($input['items'] as $item) {
        if (!empty($item['stripe_price_id']) && !empty($item['quantity'])) {
            $line_items[] = [
                'price'    => $item['stripe_price_id'],
                'quantity' => (int)$item['quantity']
            ];
        }
    }
} elseif (isset($input['stripe_price_id']) && !empty($input['stripe_price_id'])) {
    $quantity = isset($input['quantity']) ? (int)$input['quantity'] : 1;
    $line_items[] = [
        'price'    => $input['stripe_price_id'],
        'quantity' => max(1, $quantity)
    ];
}

if (empty($line_items)) {
    http_response_code(400);
    echo json_encode([
        'status'  => 'error',
        'message' => 'Invalid request payload. Missing item price details.'
    ]);
    exit();
}

// Optional fulfillment delivery fee
if (isset($input['fulfillment']) && $input['fulfillment'] === 'delivery') {
    $line_items[] = [
        'price_data' => [
            'currency'     => 'gbp',
            'product_data' => [
                'name' => 'Standard Delivery Fee',
            ],
            'unit_amount'  => 500, // £5.00 in pence
        ],
        'quantity'   => 1,
    ];
}

// 6. Construct Checkout Session Payload
// Redirects through ngrok -> Apache (8001) -> success_redirect.php
$ngrok_domain = 'https://impulsive-spirits-overpay.ngrok-free.dev';

$postData = http_build_query([
    'mode'        => 'payment',
    'success_url' => $ngrok_domain . '/Loveday_Auto/PHP/success_redirect.php?session_id={CHECKOUT_SESSION_ID}',
    'cancel_url'  => $ngrok_domain . '/Loveday_Auto/PHP/cancel_redirect.php',
    'ui_mode'     => 'hosted_page',
    'metadata'    => [
        'user_id' => $user_id
    ]
]);

// Append line items for urlencoded cURL POST
foreach ($line_items as $index => $item) {
    if (isset($item['price'])) {
        $postData .= '&' . urlencode("line_items[{$index}][price]") . '=' . urlencode($item['price']);
        $postData .= '&' . urlencode("line_items[{$index}][quantity]") . '=' . urlencode($item['quantity']);
    } elseif (isset($item['price_data'])) {
        $postData .= '&' . urlencode("line_items[{$index}][price_data][currency]") . '=' . urlencode($item['price_data']['currency']);
        $postData .= '&' . urlencode("line_items[{$index}][price_data][product_data][name]") . '=' . urlencode($item['price_data']['product_data']['name']);
        $postData .= '&' . urlencode("line_items[{$index}][price_data][unit_amount]") . '=' . urlencode($item['price_data']['unit_amount']);
        $postData .= '&' . urlencode("line_items[{$index}][quantity]") . '=' . urlencode($item['quantity']);
    }
}

// 7. Execute cURL Request to Stripe
$ch = curl_init('https://api.stripe.com/v1/checkout/sessions');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
curl_setopt($ch, CURLOPT_USERPWD, $stripe_secret_key . ':');
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/x-www-form-urlencoded'
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

if ($curlError) {
    http_response_code(500);
    echo json_encode([
        'status'  => 'error',
        'message' => 'cURL error connecting to Stripe: ' . $curlError
    ]);
    exit();
}

$responseData = json_decode($response, true);

if ($httpCode === 200 && isset($responseData['url'])) {
    echo json_encode([
        'status'     => 'success',
        'url'        => $responseData['url'],
        'session_id' => $responseData['id']
    ]);
} else {
    http_response_code($httpCode >= 400 ? $httpCode : 500);
    echo json_encode([
        'status'  => 'error',
        'message' => $responseData['error']['message'] ?? 'Failed to create Stripe checkout session.'
    ]);
}