import { RegisterData } from "./models.js";
import { awsRegisterUser, awsCodeVerification, awsAuthenticateUser } from "./aws_client.js";
import { APP_CONFIG } from "./config.js";

const setUpFormCallback = (form_id, input_id_array, handleData) => {
    let form = document.getElementById(form_id);

    function handleForm(event) { 
        event.preventDefault(); 

        let formObject = {};

        for (let input_id of input_id_array) 
            formObject[input_id] = event.target[input_id].value;
        
        handleData(formObject);
    } 

    form.addEventListener('submit', handleForm);
    return {};
};

function showSnackbar(message) {
    var snackbar = $("#snackbar");
    snackbar.find(".toast-body").text(message);
    snackbar.toast({ delay: 3000 }).toast("show");
}

const handleRegisterSubmit = (data) => {
    const registerData = new RegisterData(data);

    if (registerData.password != registerData.confirmPassword) {
        showSnackbar("Make sure that passwords match!");
        return;
    }

    //create account in aws cognito with aws-sdk library   
    awsRegisterUser(registerData);
};

const handleCodeVerification = (data) => {
    awsCodeVerification(data.verificationCode);
}

const openModal = (modalId, modalHeader, modalText) => {
    const modal = document.getElementById(modalId);
    modal.style.display = "block";

    const header = document.getElementById("modal_header");
    const ptag = document.getElementById("modal_text");

    header.innerHTML = modalHeader;
    ptag.innerHTML = modalText;
}

const closeModalSetup = (closeButtonId, modalId) => {
    document.getElementById(closeButtonId).addEventListener("click", () => document.getElementById(modalId).style.display = "none");
}

const handleLoginSubmit = (userData) => {
    console.log("Data:" + JSON.stringify(userData));
    awsAuthenticateUser(userData);
};

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

function checkLocalStorage() {
    let tokenInformation = JSON.parse(localStorage.getItem(APP_CONFIG.TOKEN_STORAGE_KEY));
    if (tokenInformation != null) {
        let information = parseJwt(tokenInformation.IdToken);
        if (information["custom:accountType"] == "student") {
            location.replace("student_dashboard.html");
        } else if (information["custom:accountType"] == "professor") {
            location.replace("professor_dashboard.html");
        }
    }

    return null;
}

export {
    setUpFormCallback,
    handleRegisterSubmit,
    openModal,
    closeModalSetup,
    handleCodeVerification,
    handleLoginSubmit,
    showSnackbar,
    parseJwt,
    checkLocalStorage
};