const express = require('express');
const SignupController = require('../../controllers/signup.controller');
const signupValidators = require('./signup-validators');

const signupRouter = express.Router();

const { body, validationResult } = require('express-validator');



signupRouter.post(
    '/',
    [
        body('username')
            .trim()
            .notEmpty()
            .isString()
            .withMessage('username must be valid'),
        body('email')
            .isEmail()
            .notEmpty()
            .withMessage('Email must be valid')
    ],
    SignupController.signup,
);

module.exports = signupRouter;