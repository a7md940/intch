module.exports = class User {
    
    constructor({ username, email, password, verified, id }) {
        if (id) {
            /** @type {string} */
            this.id = id;
        }
        /** @type {string} */
        this.username = username;
        /** @type {string} */
        this.email = email;
        /** @type {string} */
        this.password = password;
        /** @type {boolean} */
        this.verified = verified;

    }
    static build({ _id, username, email, verified, password }) {
        const result = new User({ username, email, id: _id });
        result.password = password;
        result.verified = verified;
        return result;
    }
}