const { NotFoundError } = require('@intch/common');
const { UnAuthorizedException } = require('@intch/common/http-excptions');

const jwt = require('jsonwebtoken');

const { autoBind } = require("../utils/functions");
const { AuthService, UserService } = require('./../services');
const { SendGridGateway } = require('./../gateways');
const config = require('../config/config');
module.exports = class VerificationController {
    /**
     * 
     * @param {AuthService} authService 
     * @param {UserService} userService 
     * @param {SendGridGateway} sendGridGateway 
     */
    constructor(authService, userService, sendGridGateway) {
        this.authService = authService;
        this.userService = userService;
        this.sendGridGateway = sendGridGateway;
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
                res.status(200)
                    .send({ token: this.authService.generateToken(user.id, user.username, req.hostname) });
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
        );
        res.status(200)
            .send();
    }
}
