import { APP_CONFIG } from "./config.js";
import { setUpFormCallback, handleLoginSubmit, closeModalSetup, parseJwt, checkLocalStorage } from "./helpers.js";

//if user is logged in - just redirect him to the dashboard!
checkLocalStorage();

document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("register-container");
    container.style.left = "0";
});

setUpFormCallback("form", ["username", "password"], handleLoginSubmit);

closeModalSetup("closeModalBtn", "modal");