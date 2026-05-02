<?php
header("Content-Type: application/json");

$conn = new PDO("mysql:host=localhost;dbname=task_manager", "root", "");

$id = $_GET['id'];

$stmt = $conn->prepare("SELECT role FROM users WHERE id = ?");
$stmt->execute([$id]);

echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));