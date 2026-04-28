<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$conn = new mysqli("localhost", "root", "", "pfe_db");
if ($conn->connect_error) die(json_encode(["error" => "DB connection failed"]));

$data    = json_decode(file_get_contents("php://input"), true);
$user_id = intval($data['user_id']);

$conn->query("UPDATE notifications SET is_read = 1 WHERE user_id = $user_id");
echo json_encode(["message" => "Marked as read"]);
$conn->close();
?>