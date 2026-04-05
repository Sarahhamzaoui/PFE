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

$mission_id    = $data->mission_id    ?? null;
$accomodation  = $data->accomodation  ?? '';
$transport     = $data->transport     ?? '';
$food          = $data->food          ?? '';

if (!$mission_id) {
    echo json_encode(["error" => "Mission ID is required"]);
    exit;
}

// Check if booking already exists for this mission
$check = $conn->prepare("SELECT id FROM bookings WHERE mission_id = ?");
$check->bind_param("i", $mission_id);
$check->execute();
$check->store_result();

if ($check->num_rows > 0) {
    // Update existing booking
    $stmt = $conn->prepare("
        UPDATE bookings 
        SET accomodation = ?, transport = ?, food = ?
        WHERE mission_id = ?
    ");
    $stmt->bind_param("sssi", $accomodation, $transport, $food, $mission_id);
} else {
    // Insert new booking
    $stmt = $conn->prepare("
        INSERT INTO bookings (mission_id, accomodation, transport, food)
        VALUES (?, ?, ?, ?)
    ");
    $stmt->bind_param("isss", $mission_id, $accomodation, $transport, $food);
}

if ($stmt->execute()) {
    echo json_encode(["message" => "Booking saved successfully"]);
} else {
    echo json_encode(["error" => "Failed to save booking: " . $stmt->error]);
}
?>