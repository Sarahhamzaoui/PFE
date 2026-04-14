<?php
$host     = 'localhost';
$db_name  = 'pfe_db';
$username = 'root';
$password = '';

try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$db_name;charset=utf8mb4",
        $username,
        $password
    );
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    // ⚠️ Don't echo here — just set a flag or let login.php handle it
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
    exit();
}
// ✅ No closing PHP tag