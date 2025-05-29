<?php

header("Content-Type: application/json");
require_once '../engine/JsonRepository.php';

$data = json_decode(file_get_contents("php://input"), true);
$userRepository = new JsonRepository("../database/users.json");

$user = $userRepository->findByLogin($data);
$avatar_id = $user["avatar_id"];
$avatar_url = "../../back/assets/avatars/$avatar_id.jpg";

echo json_encode(['success' => true, 'url' => $avatar_url]);