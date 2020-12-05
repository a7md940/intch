module.exports = class User {

    constructor({ id, displayName, email, verified }) {
        this.id = id;
        this.displayName = displayName;
        this.email = email;
        this.verified = verified;
    }

    static build(data) {
        const result = new User(data);
        return result;
    }
}