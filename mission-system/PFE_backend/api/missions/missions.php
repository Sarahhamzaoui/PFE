<?php
// RESTful API endpoint for managing missions it handles 3 main operations
// debugging 
ini_set('display_errors', 0);
error_reporting(0);
// CORS + response type
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
// catch all uncaught errors and return them as json 
set_exception_handler(function($e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage(), "line" => $e->getLine()]);
    exit();
});

set_error_handler(function($errno, $errstr, $errfile, $errline) {
    http_response_code(500);
    echo json_encode(["error" => $errstr, "line" => $errline]);
    exit();
});

// db connection
require_once '../../config/database.php';
$method = $_SERVER['REQUEST_METHOD'];

// handle different HTTP methods
switch ($method) {

    // ------------------------------ GET: Fetch missions ------------------------------
    case 'GET':
        $role    = $_GET['role']    ?? '';
        $user_id = (int)($_GET['user_id'] ?? 0);

        if ($role === 'employee' && $user_id > 0) {
            // employee sees only their assigned missions
            $sql = "
                SELECT 
                    m.*, 
                    CONCAT(creator.first_name, ' ', creator.last_name) AS created_by_name,
                    CONCAT(emp.first_name, ' ', emp.last_name)         AS assigned_to_name,
                    d.name AS department_name
                FROM missions m
                LEFT JOIN users creator ON m.created_by  = creator.user_id
                LEFT JOIN users emp     ON m.assigned_to = emp.user_id
                LEFT JOIN departments d ON emp.department_id = d.department_id
                WHERE m.assigned_to = ?
                ORDER BY m.created_at DESC
            ";
            // prepares the SQL statement
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$user_id]);

            } elseif ($role === 'secretary' && $user_id > 0) {
              $sql = "
                 SELECT m.*,
               CONCAT(creator.first_name, ' ', creator.last_name) AS created_by_name,
               CONCAT(emp.first_name, ' ', emp.last_name)         AS assigned_to_name,
                  d.name AS department_name
                   FROM missions m
                  LEFT JOIN users creator ON m.created_by  = creator.user_id
                   LEFT JOIN users emp     ON m.assigned_to = emp.user_id
                    LEFT JOIN departments d ON emp.department_id = d.department_id
                    WHERE m.created_by = ?
                         ORDER BY m.created_at DESC
                               ";
                            $stmt = $pdo->prepare($sql);
                       $stmt->execute([$user_id]);

        } else{
              // if the user is not an employee : manager secretary admin return ALL missions
            $sql = "
                SELECT 
                    m.*,
                    CONCAT(creator.first_name, ' ', creator.last_name) AS created_by_name,
                    CONCAT(emp.first_name, ' ', emp.last_name)         AS assigned_to_name,
                    d.name AS department_name
                FROM missions m
                LEFT JOIN users creator ON m.created_by  = creator.user_id
                LEFT JOIN users emp     ON m.assigned_to = emp.user_id
                LEFT JOIN departments d ON emp.department_id = d.department_id
                ORDER BY m.created_at DESC
            ";
            // prepares the SQL statement
            $stmt = $pdo->prepare($sql);
            $stmt->execute();
        }

        // returns all rows as associative array
        $missions = $stmt->fetchAll();

        // converts the php array to json and sends it to the frontend
        echo json_encode(["missions" => $missions]);
        break;

    // --------------------------- POST : Create new mission ----------------------------------------
    case 'POST':
        // reads the raw json body sent from the frontend and converts it to a php array
        $input = json_decode(file_get_contents('php://input'), true);

        // extracts data from the json
        $title       = trim($input['title']       ?? '');
        $destination = trim($input['destination'] ?? '');
        $start_date  = $input['start_date']       ?? '';
        $end_date    = $input['end_date']         ?? '';
        $objectives  = trim($input['objectives']  ?? '');
        $assigned_to = $input['assigned_to']      ?? null;
        $created_by  = (int)($input['created_by'] ?? 0);
        $is_urgent   = isset($input['is_urgent']) ? (int)$input['is_urgent'] : 0;
        $accommodation = trim($input['accommodation'] ?? '');
        $transport     = trim($input['transport']     ?? '');
        $needs_driver  = isset($input['needs_driver']) ? (int)$input['needs_driver'] : 0;
        $sent_date   = date('Y-m-d');


        // basic validation anything missing return 400 bad request and stop
        if (empty($title) || empty($destination) || empty($start_date) || empty($end_date) || $created_by <= 0) {
            http_response_code(400);
            echo json_encode(["message" => "Missing required fields"]);
            exit();
        }

        // prepares the insert query pending is hardcoded as default status
       $stmt = $pdo->prepare("
    INSERT INTO missions 
        (title, destination, start_date, end_date, sent_date, objectives, created_by, assigned_to, status, accommodation, transport, needs_driver, is_urgent)
    VALUES 
        (?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?,?)
");
 // success return 201, if fails return 500 internal server error
if ($stmt->execute([$title, $destination, $start_date, $end_date, $sent_date, $objectives, $created_by, $assigned_to, $accommodation, $transport, $needs_driver, $is_urgent])) {
       
            $new_id = $pdo->lastInsertId();
            http_response_code(201);
            echo json_encode([
                "message"    => "Mission created successfully",
                "mission_id" => $new_id
            ]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Failed to create mission"]);
        }
        break;

    // ----------------------------- PUT: Approve or Reject mission ------------------------------
    case 'PUT':
        // read json body
        $input = json_decode(file_get_contents('php://input'), true);

        // extract and cast values
        $mission_id   = (int)($input['mission_id']   ?? 0);
        $status       = $input['status']             ?? '';
        $validated_by = (int)($input['validated_by'] ?? 0);

        if ($mission_id <= 0 || !in_array($status, ['approved', 'rejected'])) {
            http_response_code(400);
            echo json_encode(["message" => "Invalid mission_id or status"]);
            exit();
        }

       // if approved set today date if rejected null
        $approved_date = ($status === 'approved') ? date('Y-m-d') : null;

        // extract the rejection note sent from the manager (empty string if approved)
        $note = trim($input['note'] ?? '');

        // the update query — now also saves the manager note
        $stmt = $pdo->prepare("
            UPDATE missions 
            SET status        = ?, 
                validated_by  = ?, 
                approved_date = ?,
                manager_note  = ?
            WHERE mission_id  = ?
        ");

        // update success and at least one row was affected: success message
        // else no row was affected 404, otherwise server error 500
        $stmt->execute([$status, $validated_by, $approved_date, $note, $mission_id]);

        if ($stmt->rowCount() > 0) {
            http_response_code(200);
            echo json_encode(["message" => "Mission " . ucfirst($status) . " successfully"]);
        } else {
            http_response_code(404);
            echo json_encode(["message" => "Mission not found"]);
        }
        break;

    // -------------------------------------- Default ------------------------------
    // If the method is not GET, POST, or PUT
    default:
        http_response_code(405);
        echo json_encode(["message" => "Method not allowed"]);
        break;
}
?>