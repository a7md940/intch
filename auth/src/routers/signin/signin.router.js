const express = require('express');
const { excutePipe } = require('@intch/common/middlewares');

const { container } = require('../../di-setup');
const { excuteHandler } = require('../../middlewares')
const { AuthController } = require('../../controllers');
const { ForgotPasswordDtoPipe } = require('./../../middlewares/validator-pipes');

const signinRouter = express.Router();
/** @instance @type {AuthController} */
const authController = container.resolve('authController');

signinRouter.post(
    '/',
    excuteHandler(authController.login),
);
signinRouter.post(
    '/forgot-password',
    excutePipe(ForgotPasswordDtoPipe, container),
    excuteHandler(authController.forgotPassword),
);
module.exports = signinRouter;