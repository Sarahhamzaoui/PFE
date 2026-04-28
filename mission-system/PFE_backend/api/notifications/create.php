<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$conn = new mysqli("localhost", "root", "", "pfe_db");
if ($conn->connect_error) die(json_encode(["error" => "DB connection failed"]));

$data = json_decode(file_get_contents("php://input"), true);

$user_id = $data['user_id'];
$title   = $conn->real_escape_string($data['title']);
$message = $conn->real_escape_string($data['message']);
$type    = $conn->real_escape_string($data['type'] ?? 'info');

$sql = "INSERT INTO notifications (user_id, title, message, type) VALUES ('$user_id', '$title', '$message', '$type')";

if ($conn->query($sql)) {
  echo json_encode(["message" => "Notification created"]);
} else {
  echo json_encode(["error" => $conn->error]);
}
$conn->close();
?>