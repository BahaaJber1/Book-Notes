export function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

export function isValidUsername(username) {
    const re = /^[a-zA-Z0-9_]{3,}$/; // Alphanumeric and underscores, at least 3 characters
    return re.test(username);
}

export function isValidPassword(password) {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
    return re.test(password);
}

export function isValidFirstName(firstName) {
    const re = /^[a-zA-Z]{2,}$/; // At least 2 characters, only letters
    return re.test(firstName);
}

export function isValidLastName(lastName) {
    const re = /^[a-zA-Z]{2,}$/; // At least 2 characters, only letters
    return re.test(lastName);
}

export function isPasswordMatch(password, confirmPassword) {
    return password === confirmPassword;
}


export function Validation(user) {
    const { email, username, password, firstName, lastName, matchPassword } = user;
    let errors = [];

    if (!isValidEmail(email)) {
        errors.push("Invalid email format");
    }
    if (!isValidPassword(password)) {
        errors.push("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.");
    }
    if (!isValidUsername(username)) {
        errors.push("Username must be at least 3 characters long and can only contain letters, numbers, and underscores.");
    }
    if (!isValidFirstName(firstName)) {
        errors.push("First name must be at least 2 characters long and can only contain letters.");
    }
    if (!isValidLastName(lastName)) {
        errors.push("Last name must be at least 2 characters long and can only contain letters.");
    }
    if (!isPasswordMatch(password, matchPassword)) {
        errors.push("Passwords do not match.");
    }

    return errors;
}


// export function isValidPhoneNumber(phoneNumber) {
//     const re = /^\+?[1-9]\d{1,14}$/; // E.164 format
//     return re.test(phoneNumber);
// }
