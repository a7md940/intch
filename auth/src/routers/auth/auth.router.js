const express = require('express');
const { requireAuth } = require('@intch/common/middlewares');

const { container } = require('../../di-setup');
const { excutePipe, excuteHandler } = require('../../middlewares')
const { AuthController, VerificationController } = require('../../controllers');
const config = require('../../config/config');

const authRouter = express.Router();
/** @instance @type {AuthController} */
const authController = container.resolve('authController');

/** @instance @type {VerificationController} */
const verificationController = container.resolve('verificationController');
authRouter.get(
    '/verify',
    excuteHandler(verificationController.verifyUserEmail)
);
authRouter.post(
    '/reset-password',
    requireAuth(config.jwt.secret),
    excuteHandler(authController.resetPassword)
);

authRouter.post(
    '/refresh-token',
    excuteHandler(authController.refreshToken)
);

module.exports = authRouter;