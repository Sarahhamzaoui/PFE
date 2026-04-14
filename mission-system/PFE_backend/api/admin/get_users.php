<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }
require_once '../../config/database.php';
try {
    $stmt = $pdo->query("
        SELECT u.user_id, u.employee_id, u.first_name, u.last_name,
               u.email, u.phone, u.role, u.active, u.created_at,
               d.name as department_name
        FROM users u
        LEFT JOIN departments d ON u.department_id = d.department_id
        ORDER BY u.created_at DESC
    ");
    echo json_encode($stmt->fetchAll());
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>