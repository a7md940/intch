module.exports = class SignupDto {
    /**
     * Build new instance of SignupDto class.
     * @param {string} token User token
     * @param {string} refreshToken refresh token to get new token after the actual token expires.
     * @param {string} userId User identifier
     */
    static build(token, refreshToken, userId) {
        const result = new SignupDto();
        /** @type {string} */
        result.token = token;
        /** @type {string} */
        result.refreshToken = refreshToken;
        /** @type {string} */
        result.userId = userId;
        return result;
    }
}