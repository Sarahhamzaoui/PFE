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

function createNotification($pdo, $user_id, $title, $message, $type = 'info') {
    $stmt = $pdo->prepare("INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)");
    $stmt->execute([$user_id, $title, $message, $type]);
}

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    http_response_code(400);
    echo json_encode(["error" => "No data received"]);
    exit;
}

$mission_id   = $data['mission_id']   ?? null;
$accomodation = $data['accomodation'] ?? '';
$transport    = $data['transport']    ?? '';
$food         = $data['food']         ?? '';

if (!$mission_id) {
    http_response_code(400);
    echo json_encode(["error" => "Mission ID is required"]);
    exit;
}

try {
    $delete = $pdo->prepare("DELETE FROM bookings WHERE mission_id = ?");
    $delete->execute([$mission_id]);

    if (!empty($accomodation)) {
        $stmt = $pdo->prepare("INSERT INTO bookings (mission_id, type, provider, booking_date, status) VALUES (?, 'hotel', ?, CURDATE(), 'confirmed')");
        $stmt->execute([$mission_id, $accomodation]);
    }

    if (!empty($transport)) {
        $stmt = $pdo->prepare("INSERT INTO bookings (mission_id, type, provider, booking_date, status) VALUES (?, 'transport', ?, CURDATE(), 'confirmed')");
        $stmt->execute([$mission_id, $transport]);
    }

    if (!empty($food)) {
        $stmt = $pdo->prepare("INSERT INTO bookings (mission_id, type, provider, booking_date, status, notes) VALUES (?, 'other', ?, CURDATE(), 'confirmed', 'Food/Meals')");
        $stmt->execute([$mission_id, $food]);
    }

    $update = $pdo->prepare("UPDATE missions SET booked = 1 WHERE mission_id = ?");
    $update->execute([$mission_id]);

    // ── Notify all admins and dml users ──
    $users = $pdo->query("SELECT user_id FROM users WHERE role IN ('admin','dml')");
    foreach ($users->fetchAll() as $u) {
        createNotification($pdo, $u['user_id'], 'New Booking Confirmed', 'A new vehicle booking has been confirmed.', 'success');
    }

    http_response_code(200);
    echo json_encode(["message" => "Booking saved successfully"]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
?>