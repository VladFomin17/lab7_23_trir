<?php

header("Content-Type: application/json");
require_once '../engine/JsonRepository.php';

$data = json_decode(file_get_contents("php://input"), true);
$resultsRepository = new JsonRepository("../database/results.json");
$results = $resultsRepository->findAll();

echo json_encode(['success' => true, 'stats' => $results]);

