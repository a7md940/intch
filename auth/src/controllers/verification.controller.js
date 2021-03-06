const { NotFoundError, ParameterError } = require('@intch/common');
const { UnAuthorizedException, BadRequestException } = require('@intch/common/http-excptions');

const jwt = require('jsonwebtoken');

const { autoBind } = require("../utils/functions");
const { AuthService, UserService } = require('./../services');
const { SendGridGateway } = require('./../gateways');
const config = require('../config/config');
const NatsWrapper = require('../nats-wrapper');
module.exports = class VerificationController {
    /**
     * 
     * @param {AuthService} authService 
     * @param {UserService} userService 
     * @param {SendGridGateway} sendGridGateway 
     * @param {NatsWrapper} nats 
     */
    constructor(authService, userService, sendGridGateway, nats) {
        this.authService = authService;
        this.userService = userService;
        this.sendGridGateway = sendGridGateway;
        this.nats = nats;
        autoBind(this);
    }

    /**
     * Verify user email function
     * @param {express.Request} req Request
     * @param {express.Response} res Response
     */
    async verifyUserEmail(req, res, next) {
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
                this.nats.publish('user:verified', { id: user.id });
                res.status(200)
                    .send({
                        token: this.authService.generateToken(user.id, user.username, req.hostname)
                    });
            } else {
                throw new BadRequestException('verifiyUserEmail:Useralreadyverified', 'UALDVfd20');
            }
        } else {
            this.throwUnAuthorizedError(res, 'verifiyUserEmail:Invalid:verificatoin:key.', 'VEMxINV');
        }
    }

    async resendVerificationEmail(req, res, next) {
        const { email } = req.body;
        const user = await this.userService.getUserByEmail(email);
        if (!user) {
            throw new NotFoundError('resendVerificationCode:userNotFound', 'RSVEMusntd57f');
        }

        if (user.verified) {
            throw new ParameterError(['verificationCode'], 'resendVerificationCode:userAlreadyVerified', null, 'RVCUAV_182');
        }

        // TODO: store verification code to redis so if user decided to resend the verification code, the first one will expire so we will replace it with the new one
        // so verificatoin code expiration date will depend on toke expiration date and if it stored in our redis cache or not.
        const verificationCode = this.authService.generateToken(user.id, user.username, req.hostname, '5m');
        this.sendGridGateway.sendEmail(
            config.appEmail,
            email,
            'Verification Code',
            `
            <html>
                <head>

                </head>
                <body>
                    <article>
                        <p>
                            Hi, <b>${user.username}</b>
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
        );
        res.status(200)
            .send();
    }
}
