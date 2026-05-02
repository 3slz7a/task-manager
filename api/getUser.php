<?php
header("Content-Type: application/json");

$conn = new PDO("mysql:host=localhost;dbname=task_manager", "root", "");
$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$id = $_GET['id'] ?? null;

$stmt = $conn->prepare("SELECT image FROM users WHERE id = ?");
$stmt->execute([$id]);

echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));