<?php
header("Content-Type: application/json");

try {

  $conn = new PDO("mysql:host=localhost;dbname=task_manager", "root", "");
  $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

  $name = $_POST['name'] ?? '';
  $bio = $_POST['bio'] ?? '';

  if (!$name || !$bio || !isset($_FILES['image'])) {
    echo json_encode(["status" => "error", "msg" => "missing data"]);
    exit;
  }

  $file = $_FILES['image'];

  // 🔥 فلترة نوع الصورة
  $allowed = ["image/jpeg","image/png","image/jpg","image/webp"];
  if (!in_array($file["type"], $allowed)) {
    echo json_encode(["status"=>"error","msg"=>"invalid image"]);
    exit;
  }

  // 🔥 اسم مميز
  $filename = time() . "_" . uniqid() . "_" . $file['name'];

  move_uploaded_file($file['tmp_name'], "../images/" . $filename);

  // 🔥 insert
  $stmt = $conn->prepare("
    INSERT INTO team (name, image, bio)
    VALUES (?, ?, ?)
  ");

  $stmt->execute([$name, $filename, $bio]);

  echo json_encode(["status" => "success"]);

} catch (Exception $e) {
  echo json_encode([
    "status" => "error",
    "msg" => $e->getMessage()
  ]);
}