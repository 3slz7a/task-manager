<?php
header("Content-Type: application/json");

// 🔥 اتصال بالداتابيز (PDO)
try {
  $conn = new PDO("mysql:host=localhost;dbname=task_manager", "root", "");
  $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (Exception $e) {
  echo json_encode([
    "status" => "error",
    "msg" => "DB Connection Failed"
  ]);
  exit;
}

// 🔥 استلام البيانات
$data = json_decode(file_get_contents("php://input"), true);
$id = $data["id"] ?? null;

if (!$id) {
  echo json_encode([
    "status" => "error",
    "msg" => "No ID provided"
  ]);
  exit;
}

try {

  // ================= GET TASK =================
  $stmt = $conn->prepare("SELECT * FROM tasks WHERE id = ?");
  $stmt->execute([$id]);
  $task = $stmt->fetch(PDO::FETCH_ASSOC);

  if (!$task) {
    echo json_encode([
      "status" => "error",
      "msg" => "Task not found"
    ]);
    exit;
  }

  // ================= INSERT INTO HISTORY =================
  $stmt2 = $conn->prepare("
    INSERT INTO history (task_id, title, due_date, priority, user_id)
    VALUES (?, ?, ?, ?, ?)
  ");

  $stmt2->execute([
    $task["id"],
    $task["title"],
    $task["due_date"],
    $task["priority"],
    $task["user_id"]
  ]);

  // ================= DELETE FROM TASKS =================
  $stmt3 = $conn->prepare("DELETE FROM tasks WHERE id = ?");
  $stmt3->execute([$id]);

  echo json_encode([
    "status" => "success"
  ]);

} catch (Exception $e) {
  echo json_encode([
    "status" => "error",
    "msg" => $e->getMessage()
  ]);
}