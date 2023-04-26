export const validString = function validString(string) {
    //string is not empty
    if (!string) {
        throw new Error("Argument is not a string!")
    }
    //string is correct type
    if (typeof string !== 'string') {
        throw new Error(`${string} is not of type String`)
    }
    //string length > 0
    if (string.trim().length === 0) {
        throw new Error(`${string} has a length of 0. It is an empty string`)
    }
    return string.trim();
}

export const validPassword = function validPassword(string){
    string = validString(string);
    if (string.length < 8) {
        throw new Error(`password must be at least 8 characters long`)
    }
    if(!/\d/.test(string)){
        throw new Error(`password must have at least one number`)
    }
    const specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/
    if (!/[A-Z]/.test(string)) {
        throw new Error(`password must have at least one uppercase character`)
    }
    if (!specialChars.test(string)) {
        throw new Error(`password must have at least one special character`)
    }
    return string;
}

export const validEmail =  function validEmail(string){
    string = validString(string);
    string = string.toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(string)) {
        throw new Error("Invalid email address");
    }
    return string;
}