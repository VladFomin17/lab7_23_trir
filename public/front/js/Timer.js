/**
 * Класс, представляющий таймер.
 * @class
 */
export class Timer {
    /**
     * Создает экземпляр класса Timer.
     * @constructor
     * @param {number} timeLimit - Время таймера в секундах.
     * @param {function} onTimeEnd - Функция, вызываемая при окончании времени.
     */
    constructor(timeLimit, onTimeEnd) {
        this.timeLimit = timeLimit;
        this.onTimeEnd = onTimeEnd;
        this.remainingTime = timeLimit;
        this.isRunning = false;
    }

    /**
     * Запускает таймер.
     * @method
     */
    start() {
        if (this.isRunning) return;
        if (!this.isValidTimer(this.timeLimit)) return;

        this.isRunning = true;
        this.intervalId = setInterval(() => {
            this.remainingTime = this.remainingTime - 0.1;

            if (this.remainingTime <= 0) {
                this.stop();
                this.onTimeEnd();
            }
        }, 100);
    }

    /**
     * Останавливает таймер.
     * @method
     */
    stop() {
        clearInterval(this.intervalId);
        this.isRunning = false;
    }

    /**
     * Возвращает оставшееся время в формате "мм:сс".
     * @method
     * @returns {string} Возвращает строку в формате "мм:сс".
     */
    getTimeRemaining() {
        const MINUTES = Math.floor(this.remainingTime / 60);
        const SECONDS = this.remainingTime % 60;
        const WHOLE_SECONDS = Math.floor(SECONDS);
        const TENTHS = Math.floor((SECONDS - WHOLE_SECONDS) * 10);
        return `${MINUTES.toString().padStart(2, '0')}:
            ${WHOLE_SECONDS.toString().padStart(2, '0')}:
            ${TENTHS.toString().padStart(1, '0')}`;
    }

    /**
     * Проверяет, является ли переданное время допустимым.
     * @method
     * @returns {boolean} Возвращает true, если время допустимо, иначе false.
     */
    isValidTimer() {
        if (isNaN(this.timeLimit) || this.timeLimit <= 0 || this.timeLimit > 120) {
            return false;
        }
        return true;
    }
}