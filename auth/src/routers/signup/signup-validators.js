const { body } = require('express-validator');

module.exports = [
    body('username')
        .trim()
        .notEmpty()
        .isString()
        .withMessage('username must be valid'),
    body('email')
        .isEmail()
        .notEmpty()
        .withMessage('Email must be valid')
];
