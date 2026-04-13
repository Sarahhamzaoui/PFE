<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../../config/database.php';

try {
    $sql = "
        SELECT 
            m.mission_id        AS id,
            m.title,
            m.destination,
            m.start_date,
            m.end_date,
            m.objectives,
            m.status,
            m.booked,
            m.accomodation,
            m.transport,
            m.food,
            CONCAT(creator.first_name, ' ', creator.last_name) AS created_by,
            CONCAT(emp.first_name,     ' ', emp.last_name)     AS assigned_employee
        FROM missions m
        LEFT JOIN users creator ON m.created_by  = creator.user_id
        LEFT JOIN users emp     ON m.assigned_to = emp.user_id
        WHERE m.status = 'approved'
        ORDER BY m.approved_date DESC
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $missions = $stmt->fetchAll();

    echo json_encode($missions);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
?>