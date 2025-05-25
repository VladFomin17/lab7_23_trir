<?php

header("Content-Type: application/json");
require_once '../engine/JsonRepository.php';

$data = json_decode(file_get_contents("php://input"), true);
$usersRepository = new JsonRepository("../database/users.json");

$user = $usersRepository->findByLogin($data['login']);
$myResults = $user['game-results'];

echo json_encode(['success' => true, 'stats' => $myResults]);
