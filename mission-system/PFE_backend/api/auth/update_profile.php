<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// DB connection
$conn = new mysqli("localhost", "root", "", "pfe_db");

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "DB connection failed"]);
    exit();
}

// Get data
$data = json_decode(file_get_contents("php://input"));

$user_id   = $data->user_id ?? null;
$first     = $data->first_name ?? "";
$last      = $data->last_name ?? "";
$email     = $data->email ?? "";
$phone     = $data->phone ?? "";

// Validate
if (!$user_id || !$first || !$last || !$email) {
    echo json_encode(["success" => false, "message" => "Missing required fields"]);
    exit();
}

// Update query
$stmt = $conn->prepare("UPDATE users SET first_name=?, last_name=?, email=?, phone=? WHERE id=?");
$stmt->bind_param("ssssi", $first, $last, $email, $phone, $user_id);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => "Update failed"]);
}

$stmt->close();
$conn->close();
?>