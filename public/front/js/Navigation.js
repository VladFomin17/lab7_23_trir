export class Navigation {
    constructor(gameManager) {
        this.gameManager = gameManager;
    }

    bindStartButton(callback) {
        const BUTTON = document.getElementById("start-game");
        if (BUTTON) {
            BUTTON.onclick = callback;
        }
    }

    hideStartButton() {
        const BUTTON = document.getElementById("start-game");
        if (BUTTON) {
            BUTTON.style.display = "none";
        }
    }

    bindExitButton(callback) {
        const BUTTON = document.getElementById("exit-button");
        if (BUTTON) {
            BUTTON.onclick = callback;
        }
    }

    setUserName(name) {
        const CONTAINER = document.querySelector(".user-name");
        if (CONTAINER) CONTAINER.textContent = name;
    }

    renderGameLayout() {
        const CONTAINER = document.querySelector(".game-container");
        CONTAINER.innerHTML = `
            <button id="start-game">Начать игру</button>
            <div class="thermometer-wrapper">
                <div class="thermometer">
                    <div class="mercury-column">
                        <div class="mercury" id="mercury"></div>
                    </div>
                    <div class="scale" id="thermometer-scale"></div>
                </div>
            </div>
            <div class="answers"></div>
        `;
    }

    showStopButton(callback) {
        const GAME_INFO_CONTAINER = document.querySelector(".game-info-container");
        let button = document.querySelector(".stop-btn");

        if (!button) {
            button = document.createElement("button");
            button.className = "stop-btn";
            button.textContent = "Завершить игру";
            GAME_INFO_CONTAINER.appendChild(button);
        }

        button.style.display = "block";
        button.onclick = callback;
    }

    hideGame() {
        document.querySelector(".stop-btn").style.display = "none";
        document.querySelector(".thermometer-wrapper").style.display = "none";
        document.querySelector(".answers").style.display = "none";
        document.getElementById("start-game").style.display = "block";
    }

    renderAnswers(answers, callback) {
        const CONTAINER = document.querySelector(".answers");
        CONTAINER.innerHTML = '';

        answers.forEach(answer => {
            const BUTTON = document.createElement("button");
            BUTTON.className = "answer-btn";
            BUTTON.textContent = answer;
            BUTTON.onclick = () => {
                callback(answer);
                this.disableAllAnswerButtons();
            };
            CONTAINER.appendChild(BUTTON);
        });
    }

    disableAllAnswerButtons() {
        document.querySelectorAll(".answer-btn").forEach(btn => {
            btn.onclick = null;
        });
    }

    markCorrect(value) {
        this.markAnswer(value, "correct");
    }

    markIncorrect(value) {
        this.markAnswer(value, "incorrect");
    }

    markAnswer(value, className) {
        const BUTTONS = document.querySelectorAll(".answer-btn");
        BUTTONS.forEach(btn => {
            if (parseInt(btn.textContent) === value) {
                btn.classList.add(className);
            }
        });
    }

    updateTimer(timeString) {
        const TIMER_CONTAINER = document.querySelector(".timer");
        if (TIMER_CONTAINER) TIMER_CONTAINER.textContent = `${timeString}`;
    }

    showStartButton() {
        const btn = document.getElementById("start-game");
        if (btn) btn.style.display = 'block';
    }

    hideStopButton() {
        const btn = document.querySelector(".stop-btn");
        if (btn) btn.style.display = 'none';
    }
}
