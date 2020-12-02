const express = require('express');
const { RequestValidationError } = require('@intch/common');
const { validationResult } = require('express-validator');
const { UserService } = require('./../services');

module.exports = class SignupController {
    static diName = 'signupController';
    /**
     * @param {UserService} userService 
     */
    constructor(userService) {
        this.userService = userService;
    }
    /**
     * Signup function
     * @param {express.Request} req Request
     * @param {express.Response} res Response
     */
    signup = async (req, res) => {
        const errors = validationResult(req).array();
        if (errors.length > 0) {
            throw new RequestValidationError(errors);
        }
        await this.userService.create(req.body);

        res.status(201)
        .json({ });
    }
}
