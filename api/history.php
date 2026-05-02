<?php
header("Content-Type: application/json");

try {

  $conn = new PDO("mysql:host=localhost;dbname=task_manager", "root", "");
  $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

  $user_id = $_GET['user_id'] ?? null;

  if (!$user_id) {
    echo json_encode([]);
    exit;
  }

  $stmt = $conn->prepare("
    SELECT * FROM history 
    WHERE user_id = ?
    ORDER BY deleted_at DESC
  ");

  $stmt->execute([$user_id]);
  $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

  echo json_encode($data);

} catch (Exception $e) {
  echo json_encode([
    "status" => "error",
    "msg" => $e->getMessage()
  ]);
}