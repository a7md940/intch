module.exports = class Message {

    constructor({ message, userId, creationDate, roomName }, id = null) {
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