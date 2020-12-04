const express = require('express');
const BaseController = require('@intch/common/base-controller');
const { UnAuthorizedException, BadRequestException } = require('@intch/common/http-excptions');
const jwt = require('jsonwebtoken');

const config = require('./../config/config');
const { User } = require('./../models/user');
const { UserService, AuthService } = require('../services');
const { SignupDto } = require('../dtos');
const { redisStorage } = require('../utils/redis');
const SendGridGateway = require('../gateways/send-grid.gateway');
const { AesEncryptor } = require('../utils');
module.exports = class AuthController extends BaseController {
    static diName = 'authController';

    /** @private @type {typeof redisStorage} */
    redis;

    /** @private @instance @type {SendGridGateway}*/
    sendGridGateway;

    /** @private @instance @type {UserService}*/
    userService;

    /** @private @instance @type {AuthService}*/
    authService;

    constructor(userService, authService, redis, sendGridGateway) {
        super();
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

        const verificationCode = this.authService.generateToken(createdUser.id, createdUser.username, req.hostname, '5m');
        this.sendGridGateway.sendEmail(
            config.appEmail,
            createdUser.email,
            'INTouch - Verification',
            `
            <html>
                <head>

                </head>
                <body>
                    <article>
                        <p>
                            Hi, <b>${createdUser.username}</b>
                        </p>
                        <p>
                            We are happy to join us.
                        </p>
                        <p>
                            this is your verification code.
                        </p>
                        <p>
                            note that this link will be expired in 5 minutes.
                        </p>
                        <a href="#">
                            code is: <b>${verificationCode}</b>
                        </a>
                    </article>
                </body>
            </html>
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

    /**
     * Verify user email function
     * @param {express.Request} req Request
     * @param {express.Response} res Response
     */
    verifyUserEmail = async (req, res) => {
        /** @instance @type {User} */
        let user = null;
        try {
            const verificationKey = req.query.key;
            user = await this.authService.verifyToken(verificationKey);
        } catch (exc) {
            if (exc instanceof jwt.TokenExpiredError) {
                throw new UnAuthorizedException('verifiyEmail:tokenExpired');
            }
            throw new UnAuthorizedException('verifiyEmail:tokenInvalid');
        }

        if (user) {
            if (!user.verified) {
                await this.authService.verifyUserEmail(user.id);
                res.status(200)
                    .send({ token: this.authService.generateToken(user.id, user.username, req.hostname) });
            } else {
                throw new BadRequestException('verifiyUserEmail:Useralreadyverified', 'UALDVfd20');
            }
        } else {
            this.throwUnAuthorizedError(res, 'verifiyUserEmail:Invalid:verificatoin:key.', 'VEMxINV');
        }
    }

    resetPassword = async (req, res) => {
        res.send('OK')
    }
}
