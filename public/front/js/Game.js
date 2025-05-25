import { Navigation } from './Navigation.js';
import { Thermometer } from './Thermometer.js';
import { Exercise } from './Exercise.js';
import { Timer } from './Timer.js';
import {ApiClient} from "./ApiClient.js";

export class Game {
    constructor() {
        this.minTemp = -25;
        this.maxTemp = 75;
        this.navigation = new Navigation(this);
        this.thermometer = new Thermometer(this.minTemp, this.maxTemp);
        this.exercise = new Exercise(this.minTemp, this.maxTemp);
        this.initialTime = 10; // 10 секунд на первое задание
        this.currentTimeLimit = this.initialTime;
        this.timer = null;
        this.score = 0;

        this.navigation.bindStartButton(() => this.startGame());
        this.navigation.bindExitButton(() => this.exitGame());
        this.navigation.setUserName(this.getUserName());
    }

    getUserName() {
        try {
            return JSON.parse(localStorage.getItem("currentUser")).login;
        } catch {
            return "UserName";
        }
    }

    startGame() {
        this.navigation.renderGameLayout();
        this.thermometer.drawScale();
        this.navigation.bindStartButton(() => this.startGame());
        this.navigation.hideStartButton();
        this.createExercise();
        this.updateScore();
        this.navigation.showStopButton(() => this.stopGame());
    }

    stopGame() {
        this.navigation.hideGame();
        if (this.timer) {
            this.timer.stop();
            this.currentTimeLimit = this.initialTime;
        }
        this.postResults();
        this.navigation.updateTimer("00:00");
        this.score = 0;
        this.updateScore();
    }

    exitGame() {
        localStorage.removeItem("currentUser");
        window.location.href = "../../index.html";
    }

    async createExercise() {
        const TEMPERATURE = await this.exercise.getRandomTemp();
        this.thermometer.update(TEMPERATURE);
        const ANSWERS = await this.exercise.generateAnswers(TEMPERATURE);
        if (this.timer) this.timer.stop();

        this.navigation.renderAnswers(ANSWERS, (answer) => {
            this.timer.stop();
            if (answer === TEMPERATURE) {
                this.navigation.markCorrect(answer);
                this.score += 10;
                this.updateScore();
                this.currentTimeLimit = Math.max(this.currentTimeLimit - 1, 1);
            } else {
                this.navigation.markIncorrect(answer);
            }

            setTimeout(() => {
                this.createExercise();
            }, 800);
        });

        this.timer = new Timer(this.currentTimeLimit, () => { this.stopGame(); } );

        this.timer.start();

        this.navigation.updateTimer(this.timer.getTimeRemaining());
        const timerUpdater = setInterval(() => {
            if (!this.timer.isRunning) {
                clearInterval(timerUpdater);
            } else {
                this.navigation.updateTimer(this.timer.getTimeRemaining());
            }
        }, 1000);
    }

    updateScore() {
        const SCORE_CONTAINER = document.querySelector(".score");
        SCORE_CONTAINER.textContent = this.score;
    }

    postResults() {
        const API = new ApiClient("../../back/endpoint/saveScore.php");
        const RESULT = API.post({
            login: JSON.parse(localStorage.getItem("currentUser")).login,
            score: this.score
        });
        if (!RESULT.success) {
            console.log(RESULT);
        }
    }
}
