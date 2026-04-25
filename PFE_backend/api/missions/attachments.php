<?php
// Endpoint to fetch attachments for a specific mission
// Called by the manager page when opening a mission detail modal

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }

require_once 'C:/wamp64/www/mission-system/PFE_backend/config/database.php';

// get and validate the mission_id from the query string
$mission_id = (int)($_GET['mission_id'] ?? 0);

if ($mission_id <= 0) {
    http_response_code(400);
    echo json_encode(["message" => "Missing mission_id"]);
    exit();
}

// fetch all file names linked to this mission from the attachments table
$stmt = $pdo->prepare("SELECT file_name FROM mission_attachments WHERE mission_id = ?");
$stmt->execute([$mission_id]);
$files = $stmt->fetchAll(PDO::FETCH_COLUMN);

// return both file name and a direct URL the frontend can open
$base_url = "http://localhost/mission-system/PFE_backend/uploads/missions/";
$attachments = array_map(fn($f) => [
    "name" => preg_replace('/^\d+_/', '', $f), // remove leading digits and underscore
    "url"  => $base_url . $f                   // keep full filename in url for correct path
], $files);

echo json_encode(["attachments" => $attachments]);
?>