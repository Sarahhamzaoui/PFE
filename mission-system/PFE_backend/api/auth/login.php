<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

include("../../config/database.php");

$data = json_decode(file_get_contents("php://input"));

if (!$data) {
    echo json_encode(["error" => "No data received"]);
    exit;
}

$email = $data->email ?? '';
$password = $data->password ?? '';

$sql = "SELECT * FROM users WHERE email='$email'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();

    if (password_verify($password, $user['password'])) {
        echo json_encode([
            "message" => "Login successful",  // ✅ React looks for this
            "user" => $user
        ]);
    } else {
        echo json_encode(["message" => "Wrong password"]);  // ✅ use message not error
    }
} else {
    echo json_encode(["message" => "User not found"]);  // ✅ use message not error
}