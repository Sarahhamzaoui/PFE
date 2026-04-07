<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include_once("../../config/database.php");

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["success" => false, "message" => "No data received"]);
    exit;
}

$name     = $conn->real_escape_string($data["name"]);
$location = $conn->real_escape_string($data["location"]);
$price    = floatval($data["price"]);
$tier     = $conn->real_escape_string($data["tag"]);
$desc     = $conn->real_escape_string($data["desc"]);

$sql = "INSERT INTO accommodations (name, location, price, tier, description)
        VALUES ('$name', '$location', '$price', '$tier', '$desc')";

if ($conn->query($sql)) {
    echo json_encode([
        "success" => true,
        "message" => "Accommodation added",
        "id"      => $conn->insert_id
    ]);
} else {
    echo json_encode(["success" => false, "message" => $conn->error]);
}

$conn->close();
?>