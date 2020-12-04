const express = require('express');

const { container } = require('../../di-setup');
const { excutePipe, excuteHandler } = require('../../middlewares')
const { AuthController } = require('../../controllers');
const { CreateUserDtoPipe } = require('../../middlewares/validator-pipes');

const signupROuter = express.Router();
/** @instance @type {AuthController} */
const authController = container.resolve('authController');
/** @instance @type {CreateUserDtoPipe} */
const createUserDtoPipe = container.resolve('createUserDtoPipe');

signupROuter.post(
    '/',
    excutePipe(createUserDtoPipe.transform),
    excuteHandler(authController.signup),
);
module.exports = signupROuter;