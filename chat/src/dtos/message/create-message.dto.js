const { Message, User } = require('./../../models');

module.exports = class CreateMessageDto {

    /**
     * 
     * @param {Message} message 
     * @param {User} user 
     */
    constructor(message, user) {
        this.message = message.message;
        this.creationDate = message.creationDate
        this.userId = message.userId;
        this.roomName = message.roomName;
        this.user = { username: user.username, email: user.email };
    }
}