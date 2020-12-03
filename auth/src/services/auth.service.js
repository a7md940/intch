const jwt = require('jsonwebtoken');

const config = require('./../config/config');

module.exports = class AuthService {
    static diName = 'authService';

    /**
     * @param {string} userId user identifier.
     * @param {string} username user name.
     * @param {string} host The client host.
     */
    generateToken(userId, username, host) {
        const token = jwt.sign(
            { userId, username, host }, config.jwt.secret,
            { expiresIn: config.jwt.tokenExpiresIn, issuer: config.appId }
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
}
