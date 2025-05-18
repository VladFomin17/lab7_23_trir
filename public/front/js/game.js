document.addEventListener("DOMContentLoaded", function() {
    const USERNAME_CONTAINER = document.querySelector(".user-name");
    const USERNAME = JSON.parse(localStorage.getItem("currentUser")).login;
    USERNAME_CONTAINER.textContent = USERNAME;
});

document.getElementById("exit-button").addEventListener("click", function() {
    localStorage.removeItem("currentUser");
    window.location.href = "../../index.html";
});