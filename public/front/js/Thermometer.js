/**
 * Класс термометра
 *
 * @class
 */
export class Thermometer {

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
     * Рисует шкалу термометра
     */
    drawScale() {
        const SCALE = document.getElementById('thermometer-scale');
        SCALE.innerHTML = '';

        for (let temp = this.min + 1; temp <= this.max; temp += 2) {
            const MARK = document.createElement('div');
            MARK.className = 'scale-mark';
            const PERCENT = ((temp - this.min) / (this.max - this.min)) * 100;
            MARK.style.bottom = `${PERCENT}%`;

            if (temp % 10 === 0 || temp === this.min || temp === this.max) {
                MARK.textContent = `${temp}`;
                MARK.classList.add('major');
            }

            SCALE.appendChild(MARK);
        }
    }

    /**
     * Обновляет температуру
     *
     * @param temp
     */
    update(temp) {
        const PERCENT = ((temp - this.min) / (this.max - this.min)) * 100;
        document.getElementById('mercury').style.height = `${PERCENT}%`;
    }
}
