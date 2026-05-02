<?php
header("Content-Type: application/json");
include "../php/db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
  echo json_encode(["status" => "error", "msg" => "no data"]);
  exit;
}

$title = $data["title"] ?? null;
$due_date = $data["due_date"] ?? null;
$priority = $data["priority"] ?? null;
$user_id = $data["user_id"] ?? null;

if (!$title || !$due_date || !$priority || !$user_id) {
  echo json_encode(["status" => "error", "msg" => "missing fields"]);
  exit;
}

$stmt = $conn->prepare("
  INSERT INTO tasks (title, due_date, priority, status, user_id)
  VALUES (?, ?, ?, 'todo', ?)
");

$stmt->bind_param("sssi", $title, $due_date, $priority, $user_id);

if ($stmt->execute()) {
  echo json_encode(["status" => "success"]);
} else {
  echo json_encode(["status" => "error", "msg" => $conn->error]);
}
?>