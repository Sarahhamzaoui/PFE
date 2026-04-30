<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once("../../config/database.php");

try {
    $stmt = $pdo->query("SELECT * FROM accommodations");
    $rows = $stmt->fetchAll();

    $accommodations = [];
    foreach ($rows as $row) {
        $accommodations[] = [
            "id"    => (string)$row["id"],
            "tag"   => $row["tier"],
            "name"  => $row["name"],
            "desc"  => $row["description"],
            "price" => (int)$row["price"],
            "unit"  => "/ night",
        ];
    }

    echo json_encode($accommodations);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>