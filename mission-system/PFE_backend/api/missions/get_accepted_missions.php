<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include("../../config/database.php");

// Fetch all accepted missions, joined with booking status
$sql = "
    SELECT 
        m.id,
        m.title,
        m.description,
        m.created_by,
        m.assigned_employee,
        m.status,
        CASE WHEN b.id IS NOT NULL THEN 1 ELSE 0 END AS booked,
        b.accomodation,
        b.transport,
        b.food
    FROM missions m
    LEFT JOIN bookings b ON b.mission_id = m.id
    WHERE m.status = 'accepted'
";

$result = $conn->query($sql);

if (!$result) {
    echo json_encode(["error" => "Query failed: " . $conn->error]);
    exit;
}

$missions = [];
while ($row = $result->fetch_assoc()) {
    $missions[] = $row;
}

echo json_encode($missions);
?>