<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once '../../config/database.php';

$data             = json_decode(file_get_contents("php://input"), true);
$user_id          = $data['user_id']          ?? null;
$current_password = $data['current_password'] ?? null;
$new_password     = $data['new_password']     ?? null;

if (!$user_id || !$current_password || !$new_password) {
    echo json_encode(["error" => "All fields are required"]);
    exit;
}

try {
    // Get current password hash
    $stmt = $pdo->prepare("SELECT password FROM users WHERE user_id = ?");
    $stmt->execute([$user_id]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$row) {
        echo json_encode(["error" => "User not found"]);
        exit;
    }

    if (!password_verify($current_password, $row['password'])) {
        echo json_encode(["error" => "Current password is incorrect"]);
        exit;
    }

    $hashed = password_hash($new_password, PASSWORD_BCRYPT);
    $update = $pdo->prepare("UPDATE users SET password = ? WHERE user_id = ?");
    $update->execute([$hashed, $user_id]);

    echo json_encode(["message" => "Password changed successfully"]);

} catch (PDOException $e) {
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
?>