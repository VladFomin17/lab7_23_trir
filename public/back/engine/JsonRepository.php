<?php

require_once 'Repository.php';

/**
 * Репозиторий для работы с JSON-базой
 *
 * Реализует интерфейс Repository для операций с данными пользователей и заявок
 */
class JsonRepository implements Repository
{
    /**
     * @var string Путь к файлу JSON
     */
    private string $databasePath;

    /**
     * Конструктор репозитория
     *
     * @param string $databsePath путь к файлу JSON
     */
    public function __construct(string $databsePath) {
        $this->databasePath = $databsePath;
    }

    /**
     * Метод получения всех записей из хранилища
     *
     * @return array
     */
    public function findAll(): array
    {
        $data = file_get_contents($this->databasePath);
        return json_decode($data, true);
    }

    /**
     * Метод поиска пользователя по Id
     *
     * @param string $id Id пользователя
     * @return array|null
     */
    public function findById(string $id): ?array
    {
        $items = $this->findAll();
        foreach ($items as $item) {
            if ($item['id'] === $id) {
                return $item;
            }
        }
        return null;
    }

    /**
     * Метод поиска пользователя по логину
     *
     * @param string $login Логин пользователя
     * @return array|null
     */
    public function findByLogin(string $login): ?array
    {
        $items = $this->findAll();
        foreach ($items as $item) {
            if ($item['login'] === $login) {
                return $item;
            }
        }
        return null;
    }

    /**
     * Метод сохранения нового пользователя
     *
     * @param array $data Данные о пользователе
     * @return array
     */
    public function save(array $data): array
    {
        $items = $this->findAll();
        $data['id'] = uniqid();
        $items[] = $data;
        $this->saveAll($items);
        return $data;
    }

    /**
     * Метод обновления данных о пользователе
     *
     * @param string $id Id Пользователя
     * @param array $data Новые данные
     * @return array|null
     */
    public function update(string $id, array $data): array
    {
        $items = $this->findAll();
        $updatedItem = null;

        foreach ($items as &$item) {
            if ($item['id'] === $id) {
                $item = array_merge($item, $data);
                $updatedItem = $item;
                break;
            }
        }

        if ($updatedItem) {
            $this->saveAll($items);
        }

        return $updatedItem;
    }

    /**
     * Метод удаления пользователя
     *
     * @param string $id Id пользователя
     * @return bool
     */
    public function delete(string $id): bool
    {
        $items = $this->findAll();
        $initialCount = count($items);
        $items = array_filter($items, fn($item) => $item['id'] !== $id);

        if (count($items) < $initialCount) {
            $this->saveAll(array_values($items));
            return true;
        }
        return false;
    }

    public function addScore(string $id, array $data): array
    {
        $items = $this->findAll();

        foreach ($items as &$item) {
            if ($item['id'] === $id) {
                $data['id'] = substr(uniqid(), 9, 13);
                $item['game-results'][] = $data;
                $this->saveAll($items);
                return $data;
            }
        }

        throw new Exception("Пользователь не найден");
    }

    /**
     * Метод сохранения всех данных
     *
     * @param array $items Массив пользователей
     * @return void
     */
    private function saveAll(array $items) : void
    {
        file_put_contents(
            $this->databasePath,
            json_encode($items, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)
        );
    }
}