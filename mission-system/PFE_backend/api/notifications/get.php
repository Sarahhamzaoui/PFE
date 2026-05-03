<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

$conn = new mysqli("localhost", "root", "", "pfe_db");
if ($conn->connect_error) die(json_encode(["error" => "DB connection failed"]));

// ── Auto-delete notifications older than 10 days ──
$conn->query("DELETE FROM notifications WHERE created_at < NOW() - INTERVAL 10 DAY");

$user_id = intval($_GET['user_id']);

$sql    = "SELECT * FROM notifications WHERE user_id = $user_id ORDER BY created_at DESC LIMIT 20";
$result = $conn->query($sql);

$notifications = [];
while ($row = $result->fetch_assoc()) {
  $notifications[] = $row;
}

echo json_encode($notifications);
$conn->close();
?>