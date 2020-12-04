const express = require('express');

const { container } = require('../../di-setup');
const { excutePipe, excuteHandler } = require('../../middlewares')
const { AuthController } = require('../../controllers');
const requireAuth = require('../../../../common/middlewares/require-auth');
const config = require('../../config/config');

const authRouter = express.Router();
/** @instance @type {AuthController} */
const authController = container.resolve('authController');

authRouter.get(
    '/verify',
    excuteHandler(authController.verifyUserEmail)
);
authRouter.post(
    '/reset-password',
    requireAuth(config.jwt.secret),
    excuteHandler(authController.resetPassword)
);

module.exports = authRouter;