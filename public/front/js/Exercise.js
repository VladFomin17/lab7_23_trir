export class Exercise {
    constructor(min, max) {
        this.min = min;
        this.max = max;
    }

    getRandomTemp() {
        return Math.floor(Math.random() * (this.max - this.min + 1)) + this.min;
    }

    generateAnswers(correct) {
        const OPTIONS = new Set([correct]);
        while (OPTIONS.size < 4) {
            OPTIONS.add(this.getRandomTemp());
        }
        return Array.from(OPTIONS).sort(() => Math.random() - 0.5);
    }
}
