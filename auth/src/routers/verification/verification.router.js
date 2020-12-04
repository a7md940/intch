const express = require('express');

const { container } = require('../../di-setup');
const { excutePipe, excuteHandler } = require('../../middlewares')
const { VerificationController } = require('../../controllers');

const verificationRouter = express.Router();
/** @instance @type {VerificationController} */
const verificationController = container.resolve('verificationController');

verificationRouter.get(
    '/',
    // excutePipe(resendVerificationDtoPipe.transform),
    excuteHandler(verificationController.verifyUserEmail),
);
verificationRouter.post(
    '/resend',
    // excutePipe(resendVerificationDtoPipe.transform),
    excuteHandler(verificationController.resendVerificationEmail),
);
module.exports = verificationRouter;