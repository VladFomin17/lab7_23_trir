import {ApiClient} from "./ApiClient.js";

/**
 * Отправка формы
 */
document.addEventListener("DOMContentLoaded", function() {
    showAvatars();
    listenInputEvent();
    document.getElementById("registration-form").addEventListener("submit", async(e) => {
        e.preventDefault();

        if (!isFormFilled()) {
            document.getElementById("registration-error").textContent = "Все поля должны быть заполнены";
            return;
        }

        const USER_DATA = createUser();
        const API = new ApiClient("../../back/endpoint/registration.php");

        const RESULT = await API.post(USER_DATA);

        if (!RESULT.success) {
            showErrorMessages(RESULT);
            if (!document.getElementById("registration-error").textContent) {
                document.getElementById("registration-error").textContent = RESULT.message;
            }
        } else {
            window.location.href = "../../index.html";
        }
    });
});

/**
 * Получает аватарки с сервера
 *
 * @returns {Promise<*>}
 */
async function getAvatars() {
    const API = new ApiClient("../../back/endpoint/getAvatars.php");
    const RESULT = await API.get();
    if (RESULT.success) {
        return RESULT.avatars;
    } else {
        console.log(RESULT);
    }
}

/**
 * Показывает аватарки в форме пользователю
 *
 * @returns {Promise<void>}
 */
async function showAvatars() {
    const AVATARS = await getAvatars();
    const CONTAINER = document.getElementById("avatar-selection");

    AVATARS.forEach(avatar => {
        const IMG = document.createElement('img');
        IMG.src = avatar.url;
        IMG.dataset.id = avatar.id;
        IMG.style.width = "80px";
        IMG.style.margin = "5px";
        IMG.style.cursor = "pointer";

        IMG.onclick = () => {
            document.querySelectorAll("#avatar-selection img").forEach(i =>
                i.classList.remove("selected"));
            IMG.classList.add("selected");
            document.getElementById("avatar_id").value = avatar.id;
        };

        CONTAINER.appendChild(IMG);
    });

    const DEFAULT_IMG = document.querySelector("#avatar-selection img");
    DEFAULT_IMG.classList.add("selected");
    document.getElementById("avatar_id").value = DEFAULT_IMG.dataset.id;
}

/**
 * Функция, создающая пользователя на основе данных из формы.
 *
 * @returns {object} Объект с данными пользователя
 */
function createUser() {
    const USER_DATA = {
        login: document.getElementById("login").value,
        password: document.getElementById("password").value,
        avatar_id: document.getElementById("avatar_id").value
    };

    return USER_DATA;
}

/**
 * Функция, проверяющая, заполнены ли все поля формы регистрации.
 *
 * @returns {boolean} Возвращает true, если все поля заполнены, иначе false.
 */
function isFormFilled() {
    const SELECTORS = ["#login", "#password"];
    for (const SELECTOR of SELECTORS) {
        const FIELD = document.querySelector(SELECTOR);
        if (FIELD.required && !FIELD.value.trim()) {
            return false;
        }
    }
    return true;
}

/**
 * Удаляет сообщение об ошибке поля при изменении содержимого поля
 */
function listenInputEvent() {
    const FORM_FIELDS = document.querySelectorAll("input");
    FORM_FIELDS.forEach(FIELD => {
        FIELD.addEventListener("input", () => {
            const ERROR_CONTAINER = document.querySelector(`#${FIELD.id}-error`);
            if (ERROR_CONTAINER) { ERROR_CONTAINER.textContent = ''; }
        });
    });
}

/**
 * Функция отображения сообщений об ошибках ввода данных.
 *
 * @param {Object} result Объект с результатом валидации данных.
 * @returns {void}
 */
function showErrorMessages(result) {
    if (result.errors) {
        for (const [FIELD, MESSAGE] of Object.entries(result.errors)) {
            const ERROR_CONTAINER = document.getElementById(`${FIELD}-error`);
            if (ERROR_CONTAINER) ERROR_CONTAINER.textContent = MESSAGE;
        }
    }
}

/**
 *  Функция, обрабатывающая нажатие кнопки "показать пароль" при вводе
 *
 *  @returns {void}
 */
document.querySelector('.toggle-password').addEventListener('click', function() {
    const PASSWORD_INPUT = document.getElementById('password');
    const EYE_ICON = this.querySelector('.eye-icon');

    if (PASSWORD_INPUT.type === 'password') {
        PASSWORD_INPUT.type = 'text';
        EYE_ICON.textContent = '🙈';
    } else {
        PASSWORD_INPUT.type = 'password';
        EYE_ICON.textContent = '👁️';
    }
});

/**
 * Функция, обработчик события, при котором происходит переход на страницу входа
 *
 * @returns {void}
 */
document.getElementById("login-button").addEventListener("click", function(){
    window.location.href="../../index.html";
});