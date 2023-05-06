import { checkLocalStorage, openModal, parseJwt, showSnackbar} from "./helpers.js";
import { AWS_CONFIG, APP_CONFIG } from "./config.js";


const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({
    apiVersion: '2016-04-18',
    region: AWS_CONFIG.region
});

let tokenInformation = {};

let enteredUser = {};

function awsRegisterUser(userData) {
    enteredUser = userData;

    var params = {
        ClientId: AWS_CONFIG.cognito.ClientId,
        Password: userData.password,
        Username: userData.username,
        UserAttributes:[ 
            {
                Name: 'email', 
                Value: userData.email
            }, 
            {
                Name: 'custom:accountType', 
                Value: userData.accountType
            }
        ]
    };

    cognitoidentityserviceprovider.signUp(params, function(err, data) {
        if (err){ 
            console.log(err, err.stack); 
            showSnackbar(err);
        }
        else{ 
            //open modal, and wait for input.
            openModal("modal", "Verify your email", "We sent a conformation code to the email adress you entered.");
            console.log(JSON.stringify(data));
        }
    });
};

function awsCodeVerification(userCode) {
    var params = {
        ClientId: AWS_CONFIG.cognito.ClientId, /* required */
        ConfirmationCode: userCode, /* required */
        Username: enteredUser.username, /* required */
      };
      cognitoidentityserviceprovider.confirmSignUp(params, function(err, data) {
        if (err) {
            console.log(err, err.stack);
            showSnackbar(err);
        }
        else {
            console.log(data);
            document.getElementById("modal").style.display = "none";
            //redirect to login.
            location.replace("login.html");
        } 
      });
}

function awsAuthenticateUser(userData) {
    var params = {
        "AuthFlow": "USER_PASSWORD_AUTH",
        "AuthParameters": { 
           "USERNAME" : userData.username,
           "PASSWORD": userData.password 
        },
        "ClientId": AWS_CONFIG.cognito.ClientId
    }
    cognitoidentityserviceprovider.initiateAuth(params, function(err, data) {
        if (err) {
            console.log(err, err.stack);
            showSnackbar(err);
        }
        else {
            console.log(data);
            showSnackbar("You successfully authenticated this user!");
            tokenInformation = {
                AccessToken: data.AuthenticationResult.AccessToken,
                ExpiresIn: data.AuthenticationResult.ExpiresIn,
                IdToken: data.AuthenticationResult.IdToken,
                RefreshToken: data.AuthenticationResult.RefreshToken,
                TokenType: data.AuthenticationResult.TokenType
            };

            console.log("Extracted information:");
            console.log(tokenInformation);

            localStorage.setItem(APP_CONFIG.TOKEN_STORAGE_KEY, JSON.stringify(tokenInformation));
            console.log(parseJwt(tokenInformation.IdToken));
            //preusmjeravanje u ovisnosti od tipa korisnika!
            checkLocalStorage();
        } 
    });
};

const setEnteredUser = (value) => {
    enteredUser = value;
}

export {
    awsRegisterUser,
    awsCodeVerification,
    awsAuthenticateUser,
    setEnteredUser
};
