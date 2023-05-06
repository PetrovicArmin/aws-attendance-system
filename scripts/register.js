import { handleCodeVerification, handleRegisterSubmit, setUpFormCallback, closeModalSetup, checkLocalStorage } from "./helpers.js";

//if user is in local storage - just redirect him to the dashboard page!
checkLocalStorage();

document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("register-container");
    container.style.left = "0";
});

setUpFormCallback("form", ["email", "username", "password", "confirmPassword", "accountType"], handleRegisterSubmit);
setUpFormCallback("modal_form", ["verificationCode"], handleCodeVerification);
closeModalSetup("closeModalBtn", "modal");