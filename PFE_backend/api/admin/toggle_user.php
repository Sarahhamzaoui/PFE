<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }
require_once '../../config/database.php';
$data    = json_decode(file_get_contents("php://input"), true);
$user_id = $data['user_id'] ?? null;
$active  = $data['active']  ?? null;
if (!$user_id || $active === null) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Missing fields"]);
    exit;
}
try {
    $stmt = $pdo->prepare("UPDATE users SET active = ? WHERE user_id = ?");
    $stmt->execute([$active, $user_id]);
    echo json_encode(["success" => true]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>