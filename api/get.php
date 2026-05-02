<?php
include "../php/db.php";

$user_id = $_GET["user_id"];

$result = $conn->query("SELECT * FROM tasks WHERE user_id = $user_id ORDER BY id DESC");

$tasks = [];

while ($row = $result->fetch_assoc()) {
    $tasks[] = $row;
}

echo json_encode($tasks);
?>