const express = require('express');
const { body } = require('express-validator');
const { SignupController } = require('./../../controllers');

const { container } = require('./../../di-setup');

const signupRouter = express.Router();
/** @instance @type {SignupController} */
const signupController = container.resolve(SignupController.diName); 

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
    signupController.signup,
);

module.exports = signupRouter;