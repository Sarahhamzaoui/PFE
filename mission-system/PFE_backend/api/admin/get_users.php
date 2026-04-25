<?php
// ====================== DEBUG MODE (remove after fixing) ======================
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
// =============================================================================

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ====================== MAIN CODE ======================
require_once '../../config/database.php';

try {
    // Important: Make sure PDO is set to throw exceptions
    if (!$pdo) {
        throw new Exception("Database connection \$pdo is not available");
    }

    $stmt = $pdo->query("
        SELECT 
            u.user_id, 
            u.employee_id, 
            u.first_name, 
            u.last_name,
            u.email, 
            u.phone, 
            u.role, 
            u.active, 
            u.created_at,
            d.name as department_name
        FROM users u
        LEFT JOIN departments d ON u.department_id = d.department_id
        ORDER BY u.created_at DESC
    ");

    $employees = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($employees);

} catch (Throwable $e) {   // Catch both Exception and Error (PHP 7+)
    http_response_code(500);
    echo json_encode([
        "error" => true,
        "message" => $e->getMessage(),
        "file" => $e->getFile(),
        "line" => $e->getLine()
    ]);
}
?>