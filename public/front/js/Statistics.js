import { Navigation } from './Navigation.js'
import { ApiClient } from "./ApiClient.js";

export class Statistics {
    constructor() {
        this.navigation = new Navigation(this);
        this.navigation.bindStatsButton(() => this.showMyStats());
    }

    async showMyStats() {
        this.navigation.renderStatsLayout();
        this.changeStats();
        const STATS = await this.getMyStats();
        const BEST_RESULT = this.getBestResult(STATS);

        const TABLE_HEAD = document.getElementById("stats-head");
        const HEAD = document.createElement('tr');
        HEAD.innerHTML = `
            <th>Количество игр</th>
            <th>Лучший результат</th>
        `;
        TABLE_HEAD.appendChild(HEAD);

        const TABLE_BODY = document.getElementById("stats-body");
        TABLE_BODY.innerHTML = '';
        const STATS_ROW = document.createElement('tr');
        STATS_ROW.innerHTML = `
            <td>${STATS.length}</td>
            <td>${BEST_RESULT}</td>
        `;
        TABLE_BODY.appendChild(STATS_ROW);
    }

    getBestResult(stats) {
        let bestResult = stats[0].score;
        for (let i = 1; i < stats.length; i++) {
            bestResult = Math.max(bestResult, stats[i].score);
        }
        return bestResult;
    }

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

    async showTotalStats() {
        this.navigation.renderStatsLayout();
        this.changeStats();
        const STATS = await this.getTotalStats();
        const RATED_STATS = this.rateStats(STATS);

        const TABLE_HEAD = document.getElementById("stats-head");
        const HEAD = document.createElement('tr');
        HEAD.innerHTML = `
            <th>№</th>
            <th>Имя</th>
            <th>Аватар</th>
            <th>Результат</th>
        `;
        TABLE_HEAD.appendChild(HEAD);

        const TABLE_BODY = document.getElementById("stats-body");
        TABLE_BODY.innerHTML = '';
        RATED_STATS.forEach((user, index) => {
            const NEW_ROW = document.createElement('tr');
            NEW_ROW.innerHTML = `
                <td>${index + 1}</td>
                <td>${user.login}</td>
                <td>Аватар</td>
                <td>${user.score}</td>
            `;
            TABLE_BODY.appendChild(NEW_ROW);
        });
    }

    rateStats(stats) {
        stats.sort((a, b) => a.score - b.score);
        const BEST_RESULTS = stats.slice(0, 5);
        return BEST_RESULTS;
    }

    async getTotalStats() {
        const API = new ApiClient("../../back/endpoint/getTotalStats.php");
        const RESULT = await API.get();
        if (RESULT.success) {
            return RESULT.stats;
        } else {
            console.log(RESULT);
        }
    }

    changeStats() {
        document.getElementById("stats-form").addEventListener("change", () => {
            if (document.getElementById("my-stats").checked) {
                this.showMyStats();
            } else {
                this.showTotalStats();
            }
        });
    }
}
