<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include_once("../../config/database.php");

$sql    = "SELECT * FROM accommodations";
$result = $conn->query($sql);

$accommodations = [];
while ($row = $result->fetch_assoc()) {
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
$conn->close();
?>