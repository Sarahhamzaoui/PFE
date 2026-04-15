<?php
// Endpoint to fetch attachments for a specific mission
// Called by the manager page when opening a mission detail modal

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }

require_once '../../config/database.php';

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

// fetchAll with FETCH_COLUMN returns a flat array of file names e.g. ["file1.pdf", "file2.docx"]
$files = $stmt->fetchAll(PDO::FETCH_COLUMN);

echo json_encode(["attachments" => $files]);
?>