<?php
header("Content-Type: application/json");
include "../php/db.php";

$data = json_decode(file_get_contents("php://input"), true);

$id = $data["id"] ?? null;
$status = $data["status"] ?? null;

if (!$id || !$status) {
  echo json_encode(["status" => "error"]);
  exit;
}

$stmt = $conn->prepare("UPDATE tasks SET status=? WHERE id=?");
$stmt->bind_param("si", $status, $id);

if ($stmt->execute()) {
  echo json_encode(["status" => "success"]);
} else {
  echo json_encode(["status" => "error"]);
}
?>