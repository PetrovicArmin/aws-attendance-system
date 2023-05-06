import { APP_CONFIG } from "./config.js";
import { closeModalSetup, openModal, parseJwt } from "./helpers.js";

let tokenInformation = JSON.parse(localStorage.getItem(APP_CONFIG.TOKEN_STORAGE_KEY));
let information = parseJwt(tokenInformation.IdToken);
let email = information["email"];
let username = information["cognito:username"];

console.log(username, email);

document.getElementById("logout").addEventListener("click", () => {
    localStorage.clear();
    location.replace("login.html");
});
document.getElementById("title").innerHTML = "Welcome, student " + username + " (" + email + ")!";
document.getElementById("new_course").addEventListener("click", () => openModal("modal", "Enroll to the course", "In order to enroll, you need to input data listed below:"));
closeModalSetup("closeModalBtn", "modal");
