module.exports = class SignupDto {
    /** @type {string} */
    token;
    /** @type {string} */
    refreshToken;
    /** @type {string} */
    userId;

    /**
     * Build new instance of SignupDto class.
     * @param {string} token User token
     * @param {string} refreshToken refresh token to get new token after the actual token expires.
     * @param {string} userId User identifier
     */
    static build(token, refreshToken, userId) {
        const result = new SignupDto();
        result.token = token;
        result.refreshToken = refreshToken;
        result.userId = userId;
        return result;
    }
}