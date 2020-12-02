module.exports = class User {
    /** @type {string} */
    id;
    /** @type {string} */
    username;
    /** @type {string} */
    email;

    static build({ _id, username, email }) {
        const result = new User();
        if (_id) {
            result.id = _id;
        }
        result.email = email;
        result.username = username;
        return result;
    }
}