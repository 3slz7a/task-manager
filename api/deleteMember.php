<?php
header("Content-Type: application/json");

try {

  $conn = new PDO("mysql:host=localhost;dbname=task_manager", "root", "");
  $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

  $data = json_decode(file_get_contents("php://input"), true);
  $id = $data["id"] ?? null;

  if (!$id) {
    echo json_encode(["status" => "error", "msg" => "no id"]);
    exit;
  }

  // 🔥 (اختياري) نجيب الصورة ونمسحها من السيرفر
  $stmt = $conn->prepare("SELECT image FROM team WHERE id = ?");
  $stmt->execute([$id]);
  $member = $stmt->fetch(PDO::FETCH_ASSOC);

  if ($member && file_exists("../images/" . $member["image"])) {
    unlink("../images/" . $member["image"]);
  }

  // 🔥 حذف من DB
  $stmt2 = $conn->prepare("DELETE FROM team WHERE id = ?");
  $stmt2->execute([$id]);

  echo json_encode(["status" => "success"]);

} catch (Exception $e) {
  echo json_encode([
    "status" => "error",
    "msg" => $e->getMessage()
  ]);
}