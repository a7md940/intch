const express = require('express');

const { excutePipe, excuteHandler } = require('./../../middlewares')
const { SignupController } = require('./../../controllers');
const { container } = require('./../../di-setup');
const { CreateUserDtoPipe } = require('./../../middlewares/validator-pipes');

const signupRouter = express.Router();
/** @instance @type {SignupController} */
const signupController = container.resolve(SignupController.diName);
/** @instance @type {CreateUserDtoPipe} */
const createUserDtoPipe = container.resolve(CreateUserDtoPipe.diName);
signupRouter.post(
    '/',
    excutePipe(createUserDtoPipe.transform),
    excuteHandler(signupController.signup),
);

module.exports = signupRouter;