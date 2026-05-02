<?php
header("Content-Type: application/json");

$conn = new PDO("mysql:host=localhost;dbname=task_manager", "root", "");
$data = $conn->query("SELECT * FROM team")->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($data);