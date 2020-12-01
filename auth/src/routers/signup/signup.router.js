const express = require('express');
const SignupController = require('../../controllers/signup.controller');
const signupValidators = require('./signup-validators');

const signupRouter = express.Router();

const {
    body,
    validationResult
} = require('express-validator');



signupRouter.post(
    '/',
    [
        body('username')
        .trim()
        .notEmpty()
        .withMessage('errors:signup:usernameIsRequired')
        .isString()
        .withMessage('errors:signup:usernameMustBeString'),
        body('email')
        .notEmpty()
        .withMessage('errors:signup:emailIsRequired')
        .isEmail()
        .withMessage('errors:signup:invalidEmail')
    ],
    SignupController.signup,
);

module.exports = signupRouter;