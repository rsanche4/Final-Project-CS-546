const validString = function validString(string) {
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

const validPassword = function validPassword(string) {
    string = validString(string);
    if (string.length < 8) {
        throw new Error(`password must be at least 8 characters long`)
    }
    if (!/\d/.test(string)) {
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

const validEmail = function validEmail(string) {
    string = validString(string);
    string = string.toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(string)) {
        throw new Error("Invalid email address");
    }
    return string;
}

const captureLoginSubmit = (e) => {
    const email = document.querySelector('#emailAddressInput').value;
    const password = document.querySelector('#passwordInput').value;
    const errors = [];
    try {
        validEmail(email);
    } catch (error) {
        errors.push(error.message.replace("Argument", "Email"));
    }
    try {
        validPassword(password);
    } catch (error) {
        errors.push(error.message.replace("Argument", "Password"));
    }
    if (errors.length) {
        e.preventDefault();
        const errorDiv = document.querySelector('#error');
        errorDiv.innerText = errors.join(', ');
    }
}

const setUpLogin = () => {
    const loginForm = document.querySelector('#login-form');
    loginForm.addEventListener('submit', captureLoginSubmit);
}

const captureRegisterSubmit = (e) => {
    const email = document.querySelector('#emailAddressInput').value;
    const password = document.querySelector('#passwordInput').value;
    const confirmPassword = document.querySelector('#confirmPasswordInput').value;
    const role = document.querySelector('#roleInput').value;
    const errors = [];
    const firstName = document.querySelector('#firstNameInput').value;
    const lastName = document.querySelector('#lastNameInput').value;
    try {
        validString(firstName);
    }
    catch (error) {
        errors.push(error.message.replace("Argument", "First Name"));
    }
    try {
        validString(lastName);
    }
    catch (error) {
        errors.push(error.message.replace("Argument", "Last Name"));
    }
    try {
        validEmail(email);
    } catch (error) {
        errors.push(error.message.replace("Argument", "Email"));
    }
    try {
        validPassword(password);
    } catch (error) {
        errors.push(error.message.replace("Argument", "Password"));
    }
    try {
        validString(confirmPassword);
    } catch (error) {
        errors.push(error.message.replace("Argument", "Confirm Password"));
    }
    if (password !== confirmPassword) {
        errors.push("Passwords do not match");
    }
    try {
        validString(role);
    } catch (error) {
        errors.push(error.message.replace("Argument", "Role"));
    }
    if (errors.length) {
        e.preventDefault();
        const errorDiv = document.querySelector('#error');
        errorDiv.innerText = errors.join(', ');
    }
}

const setUpRegister = () => {
    const registerForm = document.querySelector('#registration-form');
    registerForm.addEventListener('submit', captureRegisterSubmit);
}

if (document.querySelector('#registration-form')) {
    setUpRegister();
}

if (document.querySelector('#login-form')) {
    setUpLogin();
}

let add = document.getElementById('addForm');
let del = document.getElementById('delete');
let update = document.getElementById('updateForm');
let aN = document.getElementById('addName');
let aI = document.getElementById('addImage');
let aA = document.getElementById('addAddress');
let aD = document.getElementById('addDesc');
let uN = document.getElementById('updateName');
let uI = document.getElementById('updateImage');
let uA = document.getElementById('updateAddress');
let uD = document.getElementById('updateDesc')

import * as barFunc from '../../data/bars.js';

if(del) {
    del.addEventListener('click', (event) => {
        event.preventDefault();
        barFunc.removeBar(id);
        del.click();
    });
}

if(add) {
    add.addEventListener('submit', (event) => {
        event.preventDefault();
        const errors = [];
        try {
            validString(aN);
        }
        catch (error) {
            errors.push(error.message.replace("Argument", "Name"));
        }
        try {
            validString(aI);
        }
        catch (error) {
            errors.push(error.message.replace("Argument", "Image"));
        }
        try {
            validString(aA);
        } catch (error) {
            errors.push(error.message.replace("Argument", "Location"));
        }
        try {
            validString(aD);
        } catch (error) {
            errors.push(error.message.replace("Argument", "Description"));
        }
        if (errors.length) {
            e.preventDefault();
            const errorDiv = document.querySelector('#error');
            errorDiv.innerText = errors.join(', ');
        }
        add.submit();
    })
}

if(update) {
    add.addEventListener('submit', (event) => {
        event.preventDefault();
        const errors = [];
        try {
            validString(uN);
        }
        catch (error) {
            errors.push(error.message.replace("Argument", "Name"));
        }
        try {
            validString(uI);
        }
        catch (error) {
            errors.push(error.message.replace("Argument", "Image"));
        }
        try {
            validString(uA);
        } catch (error) {
            errors.push(error.message.replace("Argument", "Location"));
        }
        try {
            validString(uD);
        } catch (error) {
            errors.push(error.message.replace("Argument", "Description"));
        }
        if (errors.length) {
            e.preventDefault();
            const errorDiv = document.querySelector('#error');
            errorDiv.innerText = errors.join(', ');
        }
        update.submit();
    })
}
