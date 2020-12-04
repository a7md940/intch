const express = require('express');

const { container } = require('../../di-setup');
const { excutePipe, excuteHandler } = require('../../middlewares')
const { AuthController } = require('../../controllers');

const signinRouter = express.Router();
/** @instance @type {AuthController} */
const authController = container.resolve('authController');

signinRouter.post(
    '/',
    excuteHandler(authController.login),
);
module.exports = signinRouter;