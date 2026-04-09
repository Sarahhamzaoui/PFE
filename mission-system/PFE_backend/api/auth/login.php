<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../../config/database.php';

$input    = json_decode(file_get_contents('php://input'), true);
$email    = $input['email']    ?? '';
$password = $input['password'] ?? '';



if (empty($email) || empty($password)) {
    echo json_encode(["message" => "Please provide email and password"]);
    exit();
}

$stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch();

if ($user && password_verify($password, $user['password'])) {
    echo json_encode([
        "message" => "Login successful",
        "user" => [
            "user_id"       => $user['user_id'],
            "employee_id"   => $user['employee_id'],
            "first_name"    => $user['first_name'],
            "last_name"     => $user['last_name'],
            "email"         => $user['email'],
            "role"          => $user['role'],
            "department_id" => $user['department_id']
        ]
    ]);
} else {
    echo json_encode(["message" => "Invalid credentials"]);
}
?>