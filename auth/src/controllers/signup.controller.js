const express = require('express');

class SignupController {
    /**
     * Signup function
     * @param {express.Request} req Request
     * @param {express.Response} res Response
     */    
    static signup(req, res) {
        throw new Error('error')
        console.log(req.body);
    }
}

module.exports = SignupController;