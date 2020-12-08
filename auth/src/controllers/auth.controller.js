const { NotFoundError } = require('@intch/common');
const express = require('express');
const BaseController = require('@intch/common/base-controller');
const { UnAuthorizedException } = require('@intch/common/http-excptions');

const { GetCurrentUserDto } = require('./../dtos');
const { autoBind } = require('./../utils/functions');
const config = require('./../config/config');
const { UserService, AuthService, EmailService } = require('../services');

const SendGridGateway = require('../gateways/send-grid.gateway');
const { DecodedToken } = require('../utils');
const { RedisManager } = require('../utils/redis');
const NatsWrapper = require('./../nats-wrapper');
module.exports = class AuthController extends BaseController {

    /**
     * 
     * @param {UserService} userService 
     * @param {AuthService} authService 
     * @param {RedisManager} redis 
     * @param {SendGridGateway} sendGridGateway
     * @param {NatsWrapper} nats
     * @param {EmailService} emailService
     */
    constructor(userService, authService, redis, sendGridGateway, nats, emailService) {
        super();
        this.userService = userService;
        this.authService = authService;
        this.redis = redis;
        this.sendGridGateway = sendGridGateway;
        this.nats = nats;
        this.emailService = emailService;


        autoBind(this);
    }

    /**
     * Signup function
     * @param {express.Request} req Request
     * @param {express.Response} res Response
     */
    async signup(req, res) {
        const createdUser = await this.userService.create(req.body);

        // TODO: store verification code to redis so if user decided to resend the verification code, the first one will expire so we will replace it with the new one
        // so verificatoin code expiration date will depend on toke expiration date and if it stored in our redis cache or not.
        const verificationCode = this.authService.generateToken(createdUser.id, createdUser.username, req.hostname, '5m');
        this.sendGridGateway.sendEmail(
            config.appEmail,
            createdUser.email,
            'INTouch - Verification Code',
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
                            note that this code will be expired in 5 minutes.
                        </p>
                        code is:
                            <b>${verificationCode}</b>
                    </article>
                </body>
            </html>
            `
        )
            .then(console.log)
            .catch(console.error);

        this.nats.publish('user:created', createdUser);
        res.status(201).send();
    }

    /**
     * 
     * @param {import('express').Request} req 
     * @param {import('express').Response} res 
     */
    async resetPassword(req, res) {
        const { password } = req.body;
        const { id, username } = req.currentUser;
        const hashedPassword = this.authService.hashPassword(password, username);
        const updatedUser = await this.userService.updateUser(id, { password: hashedPassword });
        delete updatedUser.password;
        delete updatedUser.verified;
        res.status(200)
            .send(updatedUser);
    }

    /**
     * 
     * @param {import('express').Request} req 
     * @param {import('express').Response} res 
     */
    async login(req, res) {
        const { username, password } = req.body;
        const user = await this.userService.getUserByUsername(username);
        if (!user) {
            throw new UnAuthorizedException('login:invalidUsername', 'AUTHUNfd100x');
        }

        if (user.password != this.authService.hashPassword(password, username)) {
            throw new UnAuthorizedException('login:invalidPassword', 'AUTHPssD20x');
        }

        const refreshToken = this.authService.generateRefreshToken(user.id, req.hostname);
        const token = this.authService.generateToken(user.id, user.username, req.hostname);

        // store refresh token in redis cache with expire date in redis equal to refresh token expire date.
        // to be flushed automatically.
        const { expiresIn } = new DecodedToken(refreshToken);
        this.redis.add(refreshToken, user.id, expiresIn);

        const response = { userId: user.id, token, refreshToken };
        res.status(200)
            .json(response);
    }

    async refreshToken(req, res) {
        const { refreshToken } = req.body;
        const user = await this.authService.verifyToken(refreshToken);

        const decoded = new DecodedToken(refreshToken);
        if (decoded.host !== req.hostname) {
            throw new UnAuthorizedException('refreshToken:invalidHost', 'RxoNVSTH');
        }

        const userId = await this.redis.get(refreshToken)
            .then(x => x ? x.replace(/\"/g, '') : null);
        if (userId == null || (userId && userId != decoded.userId)) {
            throw new UnAuthorizedException('refreshToken:invalid', 'RTINVxa5q');
        }

        this.redis.remove(refreshToken);
        res.status(200)
            .json({
                token: this.authService.generateToken(userId, user.username, req.hostname),
                refreshToken: this.authService.generateRefreshToken(userId, req.hostname)
            });
    }

    async getCurrentUser(req, res) {
        const currentUserId = req.currentUser.id;
        const user = await this.userService.getById(currentUserId);
        res.json(new GetCurrentUserDto(user));
    }

    /**
     * 
     * @param {import('express').Request} req 
     * @param {import('express').Response} res 
     */
    async forgotPassword(req, res) {
        const { email } = req.body;
        const user = await this.userService.getUserByEmail(email);
        if (!user) {
            throw new NotFoundError('forgotPassword:noUserRegisteredByThisEmail', 'FPNURBTE_pxo3');
        }
        const code = this.authService.generateForgotPasswordCode().join(' - ');
        this.redis.get(`forgot_password_${user.id}_code`)
            .then((val) => {
                if (val) {
                    this.redis.remove(`forgot_password_${user.id}_code`)
                        .then(() => this.redis.add(`forgot_password_${user.id}_code`, code));

                } else {
                    this.redis.add(`forgot_password_${user.id}_code`, code);
                }
            })

        const emailTemplate = this.emailService.buildForgorTemplate(user.username, code);
        await this.sendGridGateway.sendEmail(config.appEmail, user.email, 'Reset password code', emailTemplate);
        res.status(200)
            .send();
    }
}
