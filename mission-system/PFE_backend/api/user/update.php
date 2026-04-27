<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once '../config/database.php'; // ✅ correct path

$data = json_decode(file_get_contents("php://input"), true);

$user_id    = $data['user_id']    ?? null;
$first_name = $data['first_name'] ?? null;
$last_name  = $data['last_name']  ?? null;
$email      = $data['email']      ?? null;
$phone      = $data['phone']      ?? null;
$password   = $data['password']   ?? null;

if (!$user_id) {
    echo json_encode(["error" => "User ID is required"]);
    exit;
}

try {
    // Check if email is taken by another user
    $check = $pdo->prepare("SELECT user_id FROM users WHERE email = ? AND user_id != ?");
    $check->execute([$email, $user_id]);
    if ($check->fetch()) {
        echo json_encode(["error" => "Email already in use"]);
        exit;
    }

    if (!empty($password)) {
        $hashed = password_hash($password, PASSWORD_BCRYPT);
        $stmt = $pdo->prepare("
            UPDATE users 
            SET first_name = ?, last_name = ?, email = ?, phone = ?, password = ?
            WHERE user_id = ?
        ");
        $stmt->execute([$first_name, $last_name, $email, $phone, $hashed, $user_id]);
    } else {
        $stmt = $pdo->prepare("
            UPDATE users 
            SET first_name = ?, last_name = ?, email = ?, phone = ?
            WHERE user_id = ?
        ");
        $stmt->execute([$first_name, $last_name, $email, $phone, $user_id]);
    }

    echo json_encode(["message" => "Profile updated successfully"]);

} catch (PDOException $e) {
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
?>