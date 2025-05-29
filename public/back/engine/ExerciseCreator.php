<?php

/**
 * Класс генерации заданий
 */
class ExerciseCreator
{
    private int $minTemp;
    private int $maxTemp;

    /**
     * Конструктор класса
     *
     * @constructor
     * @param $minTemp
     * @param $maxTemp
     */
    public function __construct($minTemp, $maxTemp) {
        $this->minTemp = $minTemp;
        $this->maxTemp = $maxTemp;
    }

    /**
     * Генерирует псевдослучайное значение температуры
     *
     * @return int
     */
    public function getRandomTemp(): int
    {
        return mt_rand($this->minTemp, $this->maxTemp);
    }

    /**
     * Генерирует псевдослучайные варианты ответов
     *
     * @param $correct
     * @return array
     */
    public function createExercise($correct): array
    {
        $set = [$correct];

        while (count($set) < 4) {
            $newTemp = $this->getRandomTemp();
            if (!in_array($newTemp, $set)) {
                $set[] = $newTemp;
            }
        }

        shuffle($set);
        return $set;
    }
}