<?php
header("Content-Type: application/json");

try {
  $conn = new PDO("mysql:host=localhost;dbname=task_manager", "root", "");
  $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

  $user_id = $_POST['user_id'] ?? null;

  if (!$user_id || !isset($_FILES['image'])) {
    echo json_encode(["status" => "error", "msg" => "missing data"]);
    exit;
  }

  $file = $_FILES['image'];

  // 🔒 فلترة بسيطة
  $allowed = ["image/jpeg","image/png","image/jpg","image/webp"];
  if (!in_array($file["type"], $allowed)) {
    echo json_encode(["status"=>"error","msg"=>"invalid type"]);
    exit;
  }

  // 🧠 اسم مميز
  $filename = time() . "_" . uniqid() . "_" . basename($file['name']);

  // 📁 احفظ في images/
  $path = "../images/" . $filename;

  if (!move_uploaded_file($file['tmp_name'], $path)) {
    echo json_encode(["status"=>"error","msg"=>"upload failed"]);
    exit;
  }

  // 💾 خزّن في DB
  $stmt = $conn->prepare("UPDATE users SET image = ? WHERE id = ?");
  $stmt->execute([$filename, $user_id]);

  echo json_encode(["status"=>"success","image"=>$filename]);

} catch (Exception $e) {
  echo json_encode(["status"=>"error","msg"=>$e->getMessage()]);
}