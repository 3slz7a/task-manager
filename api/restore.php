<?php
header("Content-Type: application/json");

try {

  $conn = new PDO("mysql:host=localhost;dbname=task_manager", "root", "");
  $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

  $data = json_decode(file_get_contents("php://input"), true);
  $task_id = $data["task_id"] ?? null;

  if (!$task_id) {
    echo json_encode(["status" => "error", "msg" => "no id"]);
    exit;
  }

  // 🔥 هات من history
  $stmt = $conn->prepare("SELECT * FROM history WHERE task_id = ?");
  $stmt->execute([$task_id]);
  $task = $stmt->fetch(PDO::FETCH_ASSOC);

  if (!$task) {
    echo json_encode(["status" => "error", "msg" => "not found"]);
    exit;
  }

  // 🔥 رجعها لـ tasks
  $stmt2 = $conn->prepare("
    INSERT INTO tasks (title, due_date, priority, status, user_id)
    VALUES (?, ?, ?, 'todo', ?)
  ");

  $stmt2->execute([
    $task["title"],
    $task["due_date"],
    $task["priority"],
    $task["user_id"]
  ]);

  // 🔥 امسح من history
  $stmt3 = $conn->prepare("DELETE FROM history WHERE task_id = ?");
  $stmt3->execute([$task_id]);

  echo json_encode(["status" => "success"]);

} catch (Exception $e) {
  echo json_encode([
    "status" => "error",
    "msg" => $e->getMessage()
  ]);
}