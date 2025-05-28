import { ApiClient } from "./ApiClient.js";

/**
 * Класс, управляющий звуками в игре
 *
 * @class
 */
export class SoundManager {

    /**
     * Коструктор класса
     *
     * @constructor
     */
    constructor() {
        this.getSounds();
    }

    /**
     * Получает звуки с сервера
     *
     * @returns {Promise<void>}
     */
    async getSounds() {
        const API = new ApiClient("../../back/endpoint/getSounds.php");
        const RESULT = await API.get();

        if (RESULT.success) {
            this.createSounds(RESULT.sounds)
        } else {
            console.log(RESULT);
        }
    }

    /**
     * Инициализирует звуки на фронте
     *
     * @param sounds
     */
    createSounds(sounds) {
        this.background = new Audio(sounds.background);
        this.success = new Audio(sounds.success);
        this.failure = new Audio(sounds.failure);

        this.background.loop = true;
        this.background.volume = 0.3;
        this.success.volume = 0.5;
        this.failure.volume = 1;
    }

    /**
     * Запускает фоновую музыку
     */
    playBackground() {
        this.background.play();
    }

    /**
     * Останавливает фоновую музыку
     */
    stopBackground() {
        this.background.pause();
        this.background.currentTime = 0;
    }

    /**
     * Запускает музыку для правильного ответа
     */
    playSuccess() {
        this.success.currentTime = 0;
        this.success.play();
    }

    /**
     * Запускает музыку для неверного ответа
     */
    playFail() {
        this.failure.currentTime = 0;
        this.failure.play();
    }
}