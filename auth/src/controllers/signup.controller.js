const express = require('express');
const {
    RequestValidationError
} = require('@intch/common');
const {
    validationResult
} = require('express-validator');

class SignupController {
    /**
     * Signup function
     * @param {express.Request} req Request
     * @param {express.Response} res Response
     */
    static signup(req, res) {
        const errors = validationResult(req).array();
        if (errors.length > 0) {
            throw new RequestValidationError(errors);
        }

        console.log(req.body);
    }
}

module.exports = SignupController;