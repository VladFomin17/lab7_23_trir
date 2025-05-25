<?php

header("Content-Type: application/json");
require_once '../engine/JsonRepository.php';
require_once '../engine/Validator.php';

// Получение данных
$data = json_decode(file_get_contents("php://input"), true);
$usersRepository = new JsonRepository("../database/users.json");

// Валидация данных
$errors = Validator::validateAll($data, $usersRepository);
if (!empty($errors)) {
    echo json_encode(["success" => false, "errors" => $errors]);
    exit;
}

// Сохранение данных пользователя
$userData = [
    'login' => $data['login'],
    'password' => $data['password'],
    'game-results' => []
];
$user = $usersRepository->save($userData);

// Отправка ответа
echo json_encode(["success" => true, "message" => "Успешная регистрация"]);