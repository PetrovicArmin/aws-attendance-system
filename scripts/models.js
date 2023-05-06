class RegisterData {
    email;
    password;
    confirmPassword;
    username;
    accountType;

    constructor(data) {
        this.email = data.email;
        this.username = data.username;
        this.password = data.password;
        this.confirmPassword = data.confirmPassword;
        this.accountType = data.accountType;
    }
};

export {
    RegisterData
};