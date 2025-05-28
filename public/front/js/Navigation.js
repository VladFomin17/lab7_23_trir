import {ApiClient} from "./ApiClient.js";

/**
 * Класс, отвечающий за навигацию на странице
 *
 * @class
 */
export class Navigation {

    /**
     * Конструктор класса
     *
     * @constructor
     * @param gameManager
     */
    constructor(gameManager) {
        this.gameManager = gameManager;
        this.currentTab = "game";
    }

    /**
     * Привязывает обработчик кнопки старта к ней
     *
     * @param callback
     */
    bindStartButton(callback) {
        const $BUTTON = $('#start-game');
        if ($BUTTON.length) {
            $BUTTON.off('click').on('click', callback);
        }
    }

    /**
     * Скрывает кнопку старта
     */
    hideStartButton() {
        const $BUTTON = $('#start-game');
        if ($BUTTON.length) {
            $BUTTON.hide();
        }
    }

    /**
     * Привязывает обработчик кнопки выхода к ней
     *
     * @param callback
     */
    bindExitButton(callback) {
        const $BUTTON = $('#exit-button');
        if ($BUTTON.length) {
            $BUTTON.off('click').on('click', callback);
        }
    }

    /**
     * Показывает имя пользователя
     *
     * @param name
     */
    setUserName(name) {
        const $CONTAINER = $('.user-name');
        if ($CONTAINER.length) $CONTAINER.text(name);
    }

    /**
     * Получает аватар пользователя с сервера
     *
     * @param login
     * @returns {Promise<*>}
     */
    async getUserAvatar(login) {
        const API = new ApiClient("../../back/endpoint/getUserAvatar.php");
        const RESULT = await API.post(login);

        if (RESULT.success) {
            return RESULT.url;
        } else {
            console.log(RESULT);
        }
    }

    /**
     * Устанавливает аватар пользователя
     *
     * @returns {Promise<void>}
     */
    async setUserAvatar() {
        const AVATAR = await this.getUserAvatar(this.gameManager.getUserName());
        const CONTAINER = $('.user-avatar-container');
        const IMG = $('<img>');
        IMG.attr('src', AVATAR)
            .css({ width: "200px", margin: "10px", cursor: "pointer" });
        CONTAINER.append(IMG);
    }

    /**
     * Меняет классы вкладок при переходе
     *
     * @param currentTab
     */
    switchTabs(currentTab) {
        $(".tab").removeClass('active');
        this.currentTab = currentTab;

        if (currentTab === "game") {
            $("#game-tab").addClass('active');
        } else {
            $("#stats-tab").addClass('active');
        }
    }

    /**
     * Привязывает обработчик к вкладке игры
     *
     * @param callback
     */
    bindGameTab(callback) {
        const GAME_TAB = $("#game-tab");
        if (this.currentTab === "stats") {
            this.currentTab = "game";
            GAME_TAB.off('click').on('click', callback);
        } else {
            GAME_TAB.off('click').on('click', () => { return; });
        }
    }

    /**
     * Привязывает обработчик к вкладке статистики
     *
     * @param callback
     */
    bindStatsTab(callback) {
        const STATS_TAB = $("#stats-tab");
        if (this.currentTab === "game") {
            this.currentTab = "stats";
            STATS_TAB.off('click').on('click', callback);
        } else {
            STATS_TAB.off('click').on('click', () => { return; });
        }
    }

    /**
     * Создает основные элементы страницы, нужные для игры
     */
    renderGameLayout() {
        const CONTAINER = $(".game-container");
        CONTAINER.html(`
        <button id="start-game">НАЧАТЬ ИГРУ</button>
        <div class="thermometer-wrapper">
            <div class="thermometer">
                <div class="mercury-column">
                    <div class="mercury" id="mercury"></div>
                </div>
                <div class="scale" id="thermometer-scale"></div>
            </div>
        </div>
        <div class="answers"></div>
    `);
    }

    /**
     * Создает элементы страницы для отображения статистики
     */
    renderStatsLayout() {
        this.switchTabs("stats");
        const CONTAINER = $(".game-container");
        CONTAINER.html(`
        <button id="start-game">НАЧАТЬ ИГРУ</button>
        <div class="stats-container">
            <div class="my-stats-name">Моя статистика</div>
            <table class="my-stats">
                <thead id="my-stats-head"></thead>
                <tbody id="my-stats-body"></tbody>
            </table>
            <div class="total-stats-name">Общая статистика</div>
            <table class="total-stats">
                <thead id="total-stats-head"></thead>
                <tbody id="total-stats-body"></tbody>
            </table>
        </div>
    `);
        this.bindGameTab(() => this.backToGame());
    }

    /**
     * Возвращает пользователя к игре
     */
    backToGame() {
        this.switchTabs("game");
        $(".stats-container").hide();
        $("#start-game").show();
    }

    /**
     * Показывает кнопку завершения игры
     *
     * @param callback
     */
    showStopButton(callback) {
        const GAME_INFO_CONTAINER = $(".game-info-container");
        let BUTTON = $(".stop-btn");

        if (!BUTTON.length) {
            BUTTON = $('<button>')
                .addClass("stop-btn")
                .text("Завершить игру");
            GAME_INFO_CONTAINER.append(BUTTON);
        }

        BUTTON.show().off('click').on('click', callback);
    }

    /**
     * Скрывает игру
     */
    hideGame() {
        $(".stop-btn").hide();
        $(".thermometer-wrapper").hide();
        $(".answers").hide();
        $(".game-info-container").hide();
        $("#start-game").show();
    }

    /**
     * Показывает варианты ответов
     *
     * @param answers
     * @param callback
     */
    renderAnswers(answers, callback) {
        const CONTAINER = $(".answers");
        CONTAINER.empty();

        answers.forEach(answer => {
            const BUTTON = $('<button>')
                .addClass("answer-btn")
                .text(answer)
                .on('click', () => {
                    callback(answer, BUTTON[0]);
                    this.disableAllAnswerButtons();
                });
            CONTAINER.append(BUTTON);
        });
    }

    /**
     * Отключает кнопки ответов
     */
    disableAllAnswerButtons() {
        $(".answer-btn").off('click');
    }

    /**
     * Меняет стили кнопки при правильном ответе
     *
     * @param value
     */
    markCorrect(value) {
        this.markAnswer(value, "correct");
    }

    /**
     * Меняет стили кнопки при неверном ответе
     *
     * @param value
     */
    markIncorrect(value) {
        this.markAnswer(value, "incorrect");
    }

    /**
     * Меняет стили кнопки при ответе
     *
     * @param value
     * @param className
     */
    markAnswer(value, className) {
        $(".answer-btn").each(function () {
            if (parseInt($(this).text()) === value) {
                $(this).addClass(className);
            }
        });
    }

    /**
     * Обновляет время на таймере
     *
     * @param timeString
     */
    updateTimer(timeString) {
        const TIMER_CONTAINER = $(".timer");
        if (TIMER_CONTAINER.length) TIMER_CONTAINER.text(timeString);
    }

}
