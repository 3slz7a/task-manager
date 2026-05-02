<?php

$conn = new mysqli("localhost", "root", "", "task_manager");

if ($conn->connect_error) {
    http_response_code(500);
    exit;
}

$conn->set_charset("utf8mb4");
?>