<?php
header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "", "task_manager");

if ($conn->connect_error) {
  echo json_encode(["status" => "error", "message" => "DB error"]);
  exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$email = $data["email"] ?? "";
$password = $data["password"] ?? "";

$stmt = $conn->prepare("SELECT id, password FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows === 1) {
  $user = $result->fetch_assoc();

  // 🔥 الحل هنا
  if (password_verify($password, $user["password"])) {

    echo json_encode([
      "status" => "success",
      "user_id" => $user["id"]
    ]);

  } else {
    echo json_encode([
      "status" => "error",
      "message" => "Wrong password"
    ]);
  }

} else {
  echo json_encode([
    "status" => "error",
    "message" => "User not found"
  ]);
}

$stmt->close();
$conn->close();