<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }
require_once '../../config/database.php';
$data = json_decode(file_get_contents("php://input"), true);
$first_name   = trim($data['first_name']   ?? '');
$last_name    = trim($data['last_name']    ?? '');
$email        = trim($data['email']        ?? '');
$password     = $data['password']          ?? '';
$role         = $data['role']              ?? 'employee';
$department_id = $data['department_id']   ?? null;
$employee_id  = trim($data['employee_id'] ?? '');
$phone        = trim($data['phone']        ?? '');
if (!$first_name || !$last_name || !$email || !$password) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Missing required fields"]);
    exit;
}
try {
    $check = $pdo->prepare("SELECT user_id FROM users WHERE email = ?");
    $check->execute([$email]);
    if ($check->fetch()) {
        echo json_encode(["success" => false, "message" => "Email already in use."]);
        exit;
    }
    $hashed = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $pdo->prepare("
        INSERT INTO users (first_name, last_name, email, password, role, department_id, employee_id, phone, active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
    ");
    $stmt->execute([$first_name, $last_name, $email, $hashed, $role, $department_id ?: null, $employee_id ?: null, $phone ?: null]);
    echo json_encode(["success" => true, "message" => "User created successfully"]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>