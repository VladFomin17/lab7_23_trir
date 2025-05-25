import {ApiClient} from "./ApiClient.js";

export class Exercise {
    constructor(min, max) {
        this.min = min;
        this.max = max;
    }

    async getExercise(correct) {
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

    async getCorrect() {
        const API = new ApiClient("../../back/endpoint/newCorrect.php");
        const RESULT = await API.post(this);

        if (RESULT.success) {
            return RESULT.correct;
        } else {
            console.log(RESULT);
        }
    }

    getRandomTemp() {
        return this.getCorrect();
        //return Math.floor(Math.random() * (this.max - this.min + 1)) + this.min;
    }

    generateAnswers(correct) {
        return this.getExercise(correct);
        /*
        const OPTIONS = new Set([correct]);
        while (OPTIONS.size < 4) {
            OPTIONS.add(this.getRandomTemp());
        }
        return Array.from(OPTIONS).sort(() => Math.random() - 0.5);
         */
    }
}
