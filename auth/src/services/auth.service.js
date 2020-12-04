const jwt = require('jsonwebtoken');

const UserService = require('./user.service');
const config = require('./../config/config');
const { ParameterError } = require('@intch/common');

module.exports = class AuthService {
    static diName = 'authService';

    /** @private @type {UserService} */
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    /**
     * @param {string} userId user identifier.
     * @param {string} username user name.
     * @param {string} host The client host.
     */
    generateToken(userId, username, host, expiresIn = config.jwt.tokenExpiresIn) {
        const token = jwt.sign(
            { userId, username, host }, config.jwt.secret,
            { expiresIn, issuer: config.appId }
        );

        return token;
    }

    /**
     * @param {string} userId user identifier.
     * @param {string} host The client host.
     */
    generateRefreshToken(userId, host) {
        const refreshToken = jwt.sign(
            { userId, host }, config.jwt.secret,
            { expiresIn: config.jwt.refreshTokenExpiresIn, issuer: config.appId }
        );

        return refreshToken;
    }

    /**
     * Verify token 
     * @param {string} token
     * @throws { jwt.TokenExpiredError | jwt.JsonWebTokenError} 
     * @returns {Promise<User>}
     */
    verifyToken(token) {
        const decoded = jwt.verify(token, config.jwt.secret);
        console.log(decoded)
        return this.userService.getById(decoded.userId);
    }
    /**
     * Confirm email verification for a specific user.
     * @param {string} userId User identiifer to confirm email verification.
     * @returns {Promise<User>}
     */
    async verifyUserEmail(userId) {
        const user = await this.userService.getById(userId);
        if (user.verified) {
            throw new ParameterError(['verified'], 'verifyUser:userAlreadyVerified');
        }
        return this.userService.updateUser(userId, { verified: true })
    }
}
