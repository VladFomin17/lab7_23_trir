<?php

class ExerciseCreator
{
    private int $minTemp;
    private int $maxTemp;

    public function __construct($minTemp, $maxTemp) {
        $this->minTemp = $minTemp;
        $this->maxTemp = $maxTemp;
    }

    public function getRandomTemp(): int
    {
        return mt_rand($this->minTemp, $this->maxTemp);
    }

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