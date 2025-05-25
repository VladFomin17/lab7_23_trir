<?php

header("Content-Type: application/json");
require_once '../engine/ExerciseCreator.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(['success' => false, 'error' => 'Invalid JSON input']);
    exit;
}

$exerciseData = new ExerciseCreator($data['min'], $data['max']);
$correct = $exerciseData->getRandomTemp();

echo json_encode(['success' => true, 'correct' => $correct]);