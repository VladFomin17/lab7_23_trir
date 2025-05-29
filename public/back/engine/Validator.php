<?php

/**
 * Класс валидации
 */
class Validator
{
    /**
     * Валидация логина пользователя
     *
     * @param string $login Логин
     * @param JsonRepository $usersRepository Хранилище данных
     * @return bool
     */
    public static function validateLogin(string $login, JsonRepository $usersRepository): bool
    {
        if ($usersRepository->findByLogin($login)) {
            return false;
        }
        return true;
    }

    /**
     * Валидация пароля
     *
     * @param string $password Пароль
     * @return bool
     */
    public static function validatePassword(string $password): bool
    {
        if ($password)
        {
            return preg_match("/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/", $password);
        }
        return true;
    }

    /**
     * Валидация всех полей
     *
     * @param array $data Данные пользователя
     * @param JsonRepository $usersRepository Хранилище данных
     * @return array
     */
    public static function validateAll(array $data, JsonRepository $usersRepository): array
    {
        $errors = [];
        if (!self::validateLogin($data['login'], $usersRepository)) {
            $id = $usersRepository->findByLogin($data['login'])['id'];
            $errors['login'] = 'Пользователь с таким логином уже существует. ID ' . $id;
        }
        if (!self::validatePassword($data['password'])) {
            $errors['password'] = '
                Пароль должен содержать минимум 6 символов, включая цифры, заглавные и строчные буквы
            ';
        }

        return $errors;
    }
}