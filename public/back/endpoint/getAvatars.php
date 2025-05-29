<?php

header("Content-Type: application/json");

$avatarDir = '../assets/avatars/';
$webDir = '../../back/assets/avatars/';
$avatars = [];

foreach (scandir($avatarDir) as $file) {
    if (preg_match('/\.(png|jpg|jpeg)$/i', $file)) {
        $id = pathinfo($file, PATHINFO_FILENAME);
        $avatars[] = [
            'id' => $id,
            'url' => "/$webDir$file"
        ];
    }
}

echo json_encode(['success' => true, 'avatars' => $avatars]);