import { Navigation } from './Navigation.js'
import { ApiClient } from "./ApiClient.js";

/**
 * Класс работы со статистикой
 *
 * @class
 */
export class Statistics {

    /**
     * Конструктор класса
     *
     * @constructor
     * @param game
     */
    constructor(game) {
        this.navigation = new Navigation(this);
        this.game = game;
        this.navigation.bindStatsTab(() => this.showStats());
    }

    /**
     * Показывает статистику
     */
    showStats() {
        if (this.game.isGameRunning) {
            this.game.stopGame();
        }
        this.navigation.renderStatsLayout();
        this.navigation.bindStartButton(() => this.game.startGame());
        this.navigation.hideStartButton();
        this.showMyStats();
        this.showTotalStats();
    }

    /**
     * Показывает статистику пользователя
     *
     * @returns {Promise<void>}
     */
    async showMyStats() {
        const STATS = await this.getMyStats();
        if (STATS.length) {
            const BEST_RESULT = this.getBestResult(STATS);

            const TABLE_HEAD = $("#my-stats-head");
            const HEAD = $("<tr>").html(`
                <th>Количество игр</th>
                <th>Лучший результат</th>
            `);
            TABLE_HEAD.append(HEAD);

            const TABLE_BODY = $("#my-stats-body");
            TABLE_BODY.empty();
            const STATS_ROW = $("<tr>").html(`
                <td>${STATS.length}</td>
                <td>${BEST_RESULT}</td>
            `);
            TABLE_BODY.append(STATS_ROW);
        } else {
            const $STATS_MESSAGE = $("<p>").html('У тебя пока нет статистики')
            $('.my-stats-name').append($STATS_MESSAGE);
        }
    }

    /**
     * Получает лучший результат
     *
     * @param stats
     * @returns {*|number}
     */
    getBestResult(stats) {
        let bestResult = stats[0].score;
        for (let i = 1; i < stats.length; i++) {
            bestResult = Math.max(bestResult, stats[i].score);
        }
        return bestResult;
    }

    /**
     * Получает статистику пользователя
     *
     * @returns {Promise<*>}
     */
    async getMyStats() {
        const API = new ApiClient("../../back/endpoint/getMyStats.php");
        const RESULT = await API.post({
            login: JSON.parse(localStorage.getItem("currentUser")).login
        });
        if (RESULT.success) {
            return RESULT.stats;
        } else {
            console.log(RESULT);
        }
    }

    /**
     * Показывает общую статистику
     *
     * @returns {Promise<void>}
     */
    async showTotalStats() {
        const STATS = await this.getTotalStats();
        const RATED_STATS = this.rateStats(STATS);

        const TABLE_HEAD = $("#total-stats-head");
        const HEAD = $("<tr>").html(`
            <th>№</th>
            <th>Имя</th>
            <th>Аватар</th>
            <th>Результат</th>
        `);
        TABLE_HEAD.append(HEAD);

        const TABLE_BODY = $("#total-stats-body");
        TABLE_BODY.empty();
        RATED_STATS.forEach((user, index) => {
            const NEW_ROW = $("<tr>").html(`
                <td>${index + 1}</td>
                <td>${user.login}</td>
                <td><img src="../../back/assets/avatars/${user.avatar_id}.jpg" alt="Аватар" width="50px"></td>
                <td>${user.score}</td>
            `);
            TABLE_BODY.append(NEW_ROW);
        });
    }

    /**
     * Рейтингует статистику
     *
     * @param stats
     * @returns {*}
     */
    rateStats(stats) {
        stats.sort((a, b) => b.score - a.score);
        return stats.slice(0, 5);
    }

    /**
     * Получает общую статистику
     *
     * @returns {Promise<*>}
     */
    async getTotalStats() {
        const API = new ApiClient("../../back/endpoint/getTotalStats.php");
        const RESULT = await API.get();
        if (RESULT.success) {
            return RESULT.stats;
        } else {
            console.log(RESULT);
        }
    }
}
