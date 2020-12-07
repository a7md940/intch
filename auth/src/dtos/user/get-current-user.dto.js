const { User } = require('./../../models/user');

module.exports = class GetCurrentUserDto {

    /**
     * 
     * @param {User} user 
     */
    constructor(user) {
        this.id = user.id;
        this.email = user.email;
        this.username = user.username;
    }
}
