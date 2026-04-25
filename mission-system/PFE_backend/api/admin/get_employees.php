<?php
// Employee Selection 
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../../config/database.php';

try {
    $stmt = $pdo->query("
        SELECT 
            u.user_id, 
            u.employee_id, 
            u.first_name, 
            u.last_name,
            u.email, 
            u.phone, 
            u.role,
            u.created_at,
            d.name as department_name
        FROM users u
        LEFT JOIN departments d ON u.department_id = d.department_id
        WHERE u.role = 'employee' 
           OR u.role = 'Employee'     -- in case role is written with capital E
        ORDER BY u.first_name ASC, u.last_name ASC
    ");

    $employees = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($employees);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        "error" => true,
        "message" => $e->getMessage()
    ]);
}
?>