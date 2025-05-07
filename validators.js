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

// export function isValidPhoneNumber(phoneNumber) {
//     const re = /^\+?[1-9]\d{1,14}$/; // E.164 format
//     return re.test(phoneNumber);
// }
