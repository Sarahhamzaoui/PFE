<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once '../../config/database.php';

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
    // Check email uniqueness
    $check = $pdo->prepare("SELECT user_id FROM users WHERE email = ? AND user_id != ?");
    $check->execute([$email, $user_id]);
    if ($check->fetch()) {
        echo json_encode(["error" => "Email already in use"]);
        exit;
    }

    // Update user
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

    // 🔥 RETURN UPDATED USER (IMPORTANT FIX)
    $stmt = $pdo->prepare("SELECT user_id, first_name, last_name, email, phone FROM users WHERE user_id = ?");
    $stmt->execute([$user_id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        "message" => "Profile updated successfully",
        "user" => $user
    ]);

} catch (PDOException $e) {
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
?>