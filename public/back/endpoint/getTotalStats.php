<?php

header("Content-Type: application/json");
require_once '../engine/JsonRepository.php';

$resultsRepository = new JsonRepository("../database/results.json");
$results = $resultsRepository->findAll();

echo json_encode(['success' => true, 'stats' => $results]);

