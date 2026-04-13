<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../../config/database.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "No data received"]);
    exit;
}

$name     = trim($data['name']     ?? '');
$location = trim($data['location'] ?? '');
$price    = floatval($data['price'] ?? 0);
$tier     = trim($data['tag']      ?? '');
$desc     = trim($data['desc']     ?? '');

if (empty($name) || empty($location) || $price <= 0) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Missing required fields"]);
    exit;
}

try {
    $stmt = $pdo->prepare("
        INSERT INTO accommodations (name, location, price, tier, description)
        VALUES (?, ?, ?, ?, ?)
    ");
    $stmt->execute([$name, $location, $price, $tier, $desc]);

    $newId = $pdo->lastInsertId();

    http_response_code(201);
    echo json_encode([
        "success" => true,
        "message" => "Accommodation added successfully",
        "id"      => $newId
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>