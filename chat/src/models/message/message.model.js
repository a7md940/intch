module.exports = class Message {

    constructor({ message, userId, creationDate, roomName, user }, id = null) {
        if (id) {
            /**
             * @type {string}
             */
            this.id = id;
        }
        this.message = message;
        this.userId = userId;
        this.creationDate = new Date(creationDate);
        this.roomName = roomName;

        if (user) {
            this.user = user;
        }
    }

    /**
     * Creates new Message instance.
     * @param {Partial<Message>} data The message data.
     * @returns {Message}
     */
    static build(data) {
        const result = new Message(data, data._id);

        return result;
    }
}