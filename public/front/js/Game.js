import { Navigation } from './Navigation.js';
import { Thermometer } from './Thermometer.js';
import { Exercise } from './Exercise.js';
import { Timer } from './Timer.js';
import { ApiClient } from "./ApiClient.js";
import {Statistics} from "./Statistics.js";
import {SoundManager} from "./SoundManager.js";

/**
 * Класс, контролирующий работу игры
 *
 * @class
 */
export class Game {

    /**
     * Конструктор класса
     *
     * @constructor
     */
    constructor() {
        this.minTemp = -25;
        this.maxTemp = 75;
        this.navigation = new Navigation(this);
        this.thermometer = new Thermometer(this.minTemp, this.maxTemp);
        this.exercise = new Exercise(this.minTemp, this.maxTemp);
        this.statistics = new Statistics(this);
        this.soundManager = new SoundManager();
        this.initialTime = 10;
        this.currentTimeLimit = this.initialTime;
        this.timer = null;
        this.score = 0;
        this.isGameRunning = false;

        this.navigation.bindStartButton(() => this.startGame());
        this.navigation.bindExitButton(() => this.exitGame());
        this.navigation.setUserName(this.getUserName());
        this.navigation.setUserAvatar();
    }

    /**
     * Метод, получающий имя пользователя из локального хранилища
     *
     * @returns {HTMLElement|*|string}
     */
    getUserName() {
        try {
            return JSON.parse(localStorage.getItem("currentUser")).login;
        } catch {
            return "UserName";
        }
    }

    /**
     * Метод, запускающий игру
     */
    startGame() {
        this.isGameRunning = true;
        this.soundManager.playBackground();
        $('.game-info-container').css('display', 'flex');
        this.navigation.renderGameLayout();
        this.thermometer.drawScale();
        this.navigation.bindStartButton(() => this.startGame());
        this.navigation.hideStartButton();
        this.createExercise();
        this.updateScore();
        this.navigation.showStopButton(() => this.stopGame());
    }

    /**
     * Метод, останавливающий игру
     */
    stopGame() {
        this.isGameRunning = false;
        this.soundManager.stopBackground();
        $('.game-info-container').hide();
        this.navigation.hideGame();
        this.showEndGameMessage();
        if (this.timer) {
            this.timer.stop();
            this.currentTimeLimit = this.initialTime;
        }
        this.postResults();
        this.navigation.updateTimer("00:00");
        this.score = 0;
        this.updateScore();
    }

    /**
     * Метод, отображающий информацию о завершении игры
     */
    showEndGameMessage() {
        const $OVERLAY = $('<div>', { class: 'game-end-overlay' });
        const $MESSAGE_DIV = $(`
            <div class="game-end-message">
                <p>Игра окончена!</p>
                <p>Твой результат: <strong>${this.score}</strong> очков</p>
                <button class="close-message-btn" id="play">Играть</button>
                <button class="close-message-btn" id="quit">Закрыть</button>
            </div>
        `);

        $('body').append($OVERLAY, $MESSAGE_DIV);

        function quit() {
            $OVERLAY.remove();
            $MESSAGE_DIV.remove();
        }

        $('#quit').on('click', quit);
        $('#play').on('click', () => {
            quit();
            this.startGame();
        });
    }

    /**
     * Метод, создающий задания
     *
     * @returns {Promise<void>}
     */
    async createExercise() {
        const TEMPERATURE = await this.exercise.getRandomTemp();
        this.thermometer.update(TEMPERATURE);
        const ANSWERS = await this.exercise.generateAnswers(TEMPERATURE);
        if (this.timer) this.timer.stop();

        this.navigation.renderAnswers(ANSWERS, (answer, button) => {
            this.timer.stop();
            if (answer === TEMPERATURE) {
                this.navigation.markCorrect(answer);
                this.showSparkleEffect(button);
                this.score += 10;
                this.updateScore();
                this.currentTimeLimit = Math.max(this.currentTimeLimit - 0.1, 1);
                this.currentTimeLimit = parseFloat(this.currentTimeLimit.toFixed(2));
                this.soundManager.playSuccess();
            } else {
                this.soundManager.playFail();
                this.navigation.markIncorrect(answer);
                this.stopGame();
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
        }, 100);
    }

    /**
     * Метод, обновляющий количество очков
     */
    updateScore() {
        const SCORE_CONTAINER = document.querySelector(".score");
        SCORE_CONTAINER.textContent = this.score;
    }

    /**
     * Метод, отправляющий результаты игры
     *
     * @returns {Promise<void>}
     */
    async postResults() {
        const API = new ApiClient("../../back/endpoint/saveScore.php");
        const RESULT = await API.post({
            login: JSON.parse(localStorage.getItem("currentUser")).login,
            score: this.score
        });
        if (!RESULT.success) {
            console.log(RESULT);
        }
    }

    /**
     * Метод, добавляющий эффект искр при выборе правильного ответа
     *
     * @param button
     */
    showSparkleEffect(button) {
        const SPARKLE_COUNT = 20;
        button.style.position = "relative";

        const COLORS = ["#FFD700", "#FF69B4", "#00BFFF", "#32CD32", "#FF4500", "#AD00FF", "#00FFAA"];

        for (let i = 0; i < SPARKLE_COUNT; i++) {
            const X = Math.random() * 80 - 40;
            const Y = Math.random() * 80 - 40;
            const COLOR = COLORS[Math.floor(Math.random() * COLORS.length)];

            const $sparkle = $('<div class="sparkle"></div>').css({
                left: "50%",
                top: "50%",
                backgroundColor: COLOR,
            });

            // 💡 Устанавливаем кастомные свойства через style.setProperty
            $sparkle[0].style.setProperty('--x', `${X}px`);
            $sparkle[0].style.setProperty('--y', `${Y}px`);

            $(button).append($sparkle);

            setTimeout(() => {
                $sparkle.remove();
            }, 1000);
        }
    }

    /**
     * Выход из аккаунта
     */
    exitGame() {
        localStorage.removeItem("currentUser");
        window.location.href = "../../index.html";
    }
}
