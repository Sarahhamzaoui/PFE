<?php
$conn = new mysqli("localhost","root","","pfe");

if($conn->connect_error){
    die("Database connection failed");
}
?>