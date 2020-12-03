const express = require('express');

const { UserService, AuthService } = require('./../services');
const { SignupDto } = require('./../dtos');
const { redisStorage } = require('./../utils/redis');
const SendGridGateway = require('../gateways/send-grid.gateway');
const { AesEncryptor } = require('../utils');
module.exports = class SignupController {
    static diName = 'signupController';

    /** @type {typeof redisStorage} */
    redis;

    /** @instance @type {SendGridGateway}*/
    sendGridGateway;

    /** @instance @type {UserService}*/
    userService;

    /** @instance @type {AuthService}*/
    authService;

    constructor(userService, authService, redis, sendGridGateway) {
        this.userService = userService;
        this.authService = authService;
        this.redis = redis;
        this.sendGridGateway = sendGridGateway;
    }

    /**
     * Signup function
     * @param {express.Request} req Request
     * @param {express.Response} res Response
     */
    signup = async (req, res) => {
        const createdUser = await this.userService.create(req.body);

        const encryptor = new AesEncryptor();
        const encryptedEmail = encryptor.encryptString(createdUser.email);

        this.sendGridGateway.sendEmail(
            'spyridon.casin@extraale.com',
            createdUser.email,
            'INTouch - Verification',
            `
                <p>
                    Hi, ${createdUser.username}
                    We are happy to join us.
                    this is your verification code.
                    <h1>code is: <b>${encryptedEmail}</b></h1>
                </p>
            `
        )
            .then(console.log)
            .catch(console.error);
        // const token = this.authService.generateToken(createdUser.id, createdUser.username, req.hostname);
        // const refreshToken = this.authService.generateRefreshToken(createdUser.id, req.hostname);

        // const response = SignupDto.build(token, refreshToken, createdUser.id);

        // this.redis.add(`refreshTokens-${createdUser.id}`, refreshToken);
        // res.status(201)
        //     .json(createdUser);
        res.status(201).send();
    }
}
