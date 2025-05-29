<?php

header("Content-Type: application/json");

$sounds = [
    "background" => "../../back/assets/audio/background.wav",
    "success"    => "../../back/assets/audio/success.mp3",
    "failure"    => "../../back/assets/audio/failure.wav"
];

foreach ($sounds as $key => $path) {
    $absolutePath = realpath(__DIR__ . '/../assets/audio/' . basename($path));
    if (!file_exists($absolutePath)) {
        echo json_encode([
            "success" => false,
            "message" => "Звук не найден"
        ]);
        exit;
    }
}

echo json_encode([
    "success" => true,
    "sounds" => $sounds
]);
