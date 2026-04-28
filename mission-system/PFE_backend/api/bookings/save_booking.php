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
    echo json_encode(["error" => "No data received"]);
    exit;
}
function createNotification($conn, $user_id, $title, $message, $type = 'info') {
  $title   = $conn->real_escape_string($title);
  $message = $conn->real_escape_string($message);
  $type    = $conn->real_escape_string($type);
  $conn->query("INSERT INTO notifications (user_id, title, message, type) VALUES ('$user_id', '$title', '$message', '$type')");
}

// Notify all dml users and admins when booking is saved:
$users = $conn->query("SELECT user_id FROM users WHERE role IN ('admin','dml')");
while ($u = $users->fetch_assoc()) {
  createNotification($conn, $u['user_id'], 'New Booking Confirmed', 'A new vehicle booking has been confirmed.', 'success');
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
    // Delete old bookings for this mission first
    $delete = $pdo->prepare("DELETE FROM bookings WHERE mission_id = ?");
    $delete->execute([$mission_id]);

    // Insert accommodation
    if (!empty($accomodation)) {
        $stmt = $pdo->prepare("
            INSERT INTO bookings (mission_id, type, provider, booking_date, status)
            VALUES (?, 'hotel', ?, CURDATE(), 'confirmed')
        ");
        $stmt->execute([$mission_id, $accomodation]);
    }

    // Insert transport
    if (!empty($transport)) {
        $stmt = $pdo->prepare("
            INSERT INTO bookings (mission_id, type, provider, booking_date, status)
            VALUES (?, 'transport', ?, CURDATE(), 'confirmed')
        ");
        $stmt->execute([$mission_id, $transport]);
    }

    // Insert food as 'other'
    if (!empty($food)) {
        $stmt = $pdo->prepare("
            INSERT INTO bookings (mission_id, type, provider, booking_date, status, notes)
            VALUES (?, 'other', ?, CURDATE(), 'confirmed', 'Food/Meals')
        ");
        $stmt->execute([$mission_id, $food]);
    }

    // Mark mission as booked
    $update = $pdo->prepare("UPDATE missions SET booked = 1 WHERE mission_id = ?");
    $update->execute([$mission_id]);

    http_response_code(200);
    echo json_encode(["message" => "Booking saved successfully"]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
?>