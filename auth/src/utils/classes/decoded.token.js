const jwt = require('jsonwebtoken');
module.exports = class DecodedToken {
    constructor(token) {
        const { userId, username, host, exp } = jwt.decode(token);
        /**@type {string} */
        this.userId = userId;
        /**@type {string} */
        this.username = username;
        /**@type {string} */
        this.host = host;
        /**@type {Date} */
        this.expiresIn = new Date(exp * 1000);
    }
} 