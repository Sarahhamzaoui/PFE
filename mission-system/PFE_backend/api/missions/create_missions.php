<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include("../../config/database.php");

$data = json_decode(file_get_contents("php://input"));

if (!$data) {
    echo json_encode(["error" => "No data received"]);
    exit;
}

$title             = $data->title             ?? '';
$description       = $data->description       ?? '';
$created_by        = $data->created_by        ?? '';
$assigned_employee = $data->assigned_employee ?? '';

if (!$title || !$created_by) {
    echo json_encode(["error" => "Title and created_by are required"]);
    exit;
}

$stmt = $conn->prepare("
    INSERT INTO missions (title, description, created_by, assigned_employee, status)
    VALUES (?, ?, ?, ?, 'pending')
");
$stmt->bind_param("ssss", $title, $description, $created_by, $assigned_employee);

if ($stmt->execute()) {
    echo json_encode(["message" => "Mission created successfully", "id" => $conn->insert_id]);
} else {
    echo json_encode(["error" => "Failed to create mission: " . $stmt->error]);
}
?>