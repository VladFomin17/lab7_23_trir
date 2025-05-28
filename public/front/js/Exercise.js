import {ApiClient} from "./ApiClient.js";

/**
 * Класс, запрашивающий задания с сервера
 *
 * @class
 */
export class Exercise {

    /**
     * Конструктор класса
     *
     * @constructor
     * @param min
     * @param max
     */
    constructor(min, max) {
        this.min = min;
        this.max = max;
    }

    /**
     * Функция запрашивает варианты ответов с сервера
     *
     * @param correct
     * @returns {Promise<Exercise>}
     */
    async generateAnswers(correct) {
        const API = new ApiClient("../../back/endpoint/newExercise.php");
        const RESULT = await API.post({
            min: this.min,
            max: this.max,
            correct: correct
        });

        if (RESULT.success) {
            return RESULT.exercise;
        } else {
            console.log(RESULT);
        }
    }

    /**
     * Функция запрашивает верный ответ для задания с сервера
     *
     * @returns {Promise<*>}
     */
    async getRandomTemp() {
        const API = new ApiClient("../../back/endpoint/newCorrect.php");
        const RESULT = await API.post(this);

        if (RESULT.success) {
            return RESULT.correct;
        } else {
            console.log(RESULT);
        }
    }
}
