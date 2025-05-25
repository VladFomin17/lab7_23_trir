<?php

header("Content-Type: application/json");
require_once '../engine/JsonRepository.php';

$data = json_decode(file_get_contents("php://input"), true);
$usersRepository = new JsonRepository("../database/users.json");
$resultsRepository = new JsonRepository("../database/results.json");

$user = $usersRepository->findByLogin($data['login']);
$resultsData = ['score' => $data['score']];
try {
    $usersRepository->addScore($user['id'], $resultsData);
} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => $e]);
    exit;
}

$scoreData = [
    'id' => $user['id'],
    'login' => $user['login'],
    'score' => $data['score']
];
$score = $resultsRepository->save($scoreData);
echo json_encode(["success" => true]);
