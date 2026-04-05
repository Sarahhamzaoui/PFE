<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include("../../config/database.php");

// GET — fetch all missions for manager to review
if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    $sql = "SELECT * FROM missions ORDER BY id DESC";
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
    exit;
}

// POST — accept or reject a mission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $data = json_decode(file_get_contents("php://input"));

    $mission_id = $data->mission_id ?? null;
    $status     = $data->status     ?? null; // "accepted" or "rejected"

    if (!$mission_id || !$status) {
        echo json_encode(["error" => "mission_id and status are required"]);
        exit;
    }

    if (!in_array($status, ['accepted', 'rejected'])) {
        echo json_encode(["error" => "Status must be 'accepted' or 'rejected'"]);
        exit;
    }

    $stmt = $conn->prepare("UPDATE missions SET status = ? WHERE id = ?");
    $stmt->bind_param("si", $status, $mission_id);

    if ($stmt->execute()) {
        echo json_encode(["message" => "Mission " . $status . " successfully"]);
    } else {
        echo json_encode(["error" => "Failed to update mission: " . $stmt->error]);
    }

    exit;
}
?>