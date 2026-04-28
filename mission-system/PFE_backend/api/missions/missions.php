<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

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

require_once '../../config/database.php';

// ── Notification helper ──────────────────────────────────────────────
function createNotification($pdo, $user_id, $title, $message, $type = 'info') {
    $stmt = $pdo->prepare("INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)");
    $stmt->execute([$user_id, $title, $message, $type]);
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {

    case 'GET':
        $role    = $_GET['role']    ?? '';
        $user_id = (int)($_GET['user_id'] ?? 0);

        if ($role === 'employee' && $user_id > 0) {
            $sql = "
                SELECT m.*,
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

        } else {
            $sql = "
                SELECT m.*,
                    CONCAT(creator.first_name, ' ', creator.last_name) AS created_by_name,
                    CONCAT(emp.first_name, ' ', emp.last_name)         AS assigned_to_name,
                    d.name AS department_name
                FROM missions m
                LEFT JOIN users creator ON m.created_by  = creator.user_id
                LEFT JOIN users emp     ON m.assigned_to = emp.user_id
                LEFT JOIN departments d ON emp.department_id = d.department_id
                ORDER BY m.created_at DESC
            ";
            $stmt = $pdo->prepare($sql);
            $stmt->execute();
        }

        $missions = $stmt->fetchAll();
        echo json_encode(["missions" => $missions]);
        break;

    case 'POST':
        $title         = trim($_POST['title']         ?? '');
        $destination   = trim($_POST['destination']   ?? '');
        $start_date    = $_POST['start_date']         ?? '';
        $end_date      = $_POST['end_date']           ?? '';
        $objectives    = trim($_POST['objectives']    ?? '');
        $assigned_to   = $_POST['assigned_to']        ?? null;
        $created_by    = (int)($_POST['created_by']   ?? 0);
        $is_urgent     = isset($_POST['is_urgent'])   ? (int)$_POST['is_urgent']   : 0;
        $accommodation = trim($_POST['accommodation'] ?? '');
        $transport     = trim($_POST['transport']     ?? '');
        $needs_driver  = isset($_POST['needs_driver']) ? (int)$_POST['needs_driver'] : 0;
        $sent_date     = date('Y-m-d');

        if (empty($title) || empty($destination) || empty($start_date) || empty($end_date) || $created_by <= 0) {
            http_response_code(400);
            echo json_encode(["message" => "Missing required fields"]);
            exit();
        }

        $stmt = $pdo->prepare("
            INSERT INTO missions 
                (title, destination, start_date, end_date, sent_date, objectives, created_by, assigned_to, status, accommodation, transport, needs_driver, is_urgent)
            VALUES 
                (?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?)
        ");

        if ($stmt->execute([$title, $destination, $start_date, $end_date, $sent_date, $objectives, $created_by, $assigned_to, $accommodation, $transport, $needs_driver, $is_urgent])) {
            $new_id = $pdo->lastInsertId();

            // ── Notify all admins and managers ──
            $managers = $pdo->query("SELECT user_id FROM users WHERE role IN ('admin','manager')");
            foreach ($managers->fetchAll() as $u) {
                createNotification($pdo, $u['user_id'], 'New Mission Created', 'A new mission has been submitted and needs review.', 'info');
            }

            if (!empty($_FILES['attachments'])) {
                $upload_dir = '../../uploads/missions/';
                if (!is_dir($upload_dir)) mkdir($upload_dir, 0755, true);

                $att_stmt = $pdo->prepare("INSERT INTO mission_attachments (mission_id, file_name) VALUES (?, ?)");
                $files    = $_FILES['attachments'];
                $count    = is_array($files['name']) ? count($files['name']) : 1;

                for ($i = 0; $i < $count; $i++) {
                    $name  = is_array($files['name'])     ? $files['name'][$i]     : $files['name'];
                    $tmp   = is_array($files['tmp_name']) ? $files['tmp_name'][$i] : $files['tmp_name'];
                    $error = is_array($files['error'])    ? $files['error'][$i]    : $files['error'];

                    if ($error === UPLOAD_ERR_OK) {
                        $safe_name = time() . '_' . basename($name);
                        move_uploaded_file($tmp, $upload_dir . $safe_name);
                        $att_stmt->execute([$new_id, $safe_name]);
                    }
                }
            }

            http_response_code(201);
            echo json_encode(["message" => "Mission submitted successfully", "mission_id" => $new_id]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Failed to create mission"]);
        }
        break;

    case 'PUT':
        $input        = json_decode(file_get_contents('php://input'), true);
        $mission_id   = (int)($input['mission_id']   ?? 0);
        $status       = $input['status']             ?? '';
        $validated_by = (int)($input['validated_by'] ?? 0);

        if ($mission_id <= 0 || !in_array($status, ['approved', 'rejected'])) {
            http_response_code(400);
            echo json_encode(["message" => "Invalid mission_id or status"]);
            exit();
        }

        $approved_date = ($status === 'approved') ? date('Y-m-d') : null;
        $note          = trim($input['note'] ?? '');

        $stmt = $pdo->prepare("
            UPDATE missions 
            SET status        = ?, 
                validated_by  = ?, 
                approved_date = ?,
                manager_note  = ?
            WHERE mission_id  = ?
        ");
        $stmt->execute([$status, $validated_by, $approved_date, $note, $mission_id]);

        if ($stmt->rowCount() > 0) {
            // ── Notify the mission owner ──
            $mission = $pdo->query("SELECT assigned_to FROM missions WHERE mission_id = $mission_id")->fetch();
            if ($mission && $mission['assigned_to']) {
                $title   = $status === 'approved' ? 'Mission Approved' : 'Mission Rejected';
                $message = $status === 'approved' ? 'Your mission has been approved.' : 'Your mission has been rejected.';
                $type    = $status === 'approved' ? 'success' : 'error';
                createNotification($pdo, $mission['assigned_to'], $title, $message, $type);
            }

            http_response_code(200);
            echo json_encode(["message" => "Mission " . ucfirst($status) . " successfully"]);
        } else {
            http_response_code(404);
            echo json_encode(["message" => "Mission not found"]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["message" => "Method not allowed"]);
        break;
}
?>