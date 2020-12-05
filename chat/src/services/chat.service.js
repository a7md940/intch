
const autoBind = require('@intch/common/utils/auto-bind');

const { Message } = require('../models');
const idResolver = require('../presistence/id-resolver');
const { MessageRepository, UserRepository } = require('./../presistence/repositories');

module.exports = class ChatService {
    /**
     * @param {MessageRepository} messageRepo 
     * @param {UserRepository} userRepo 
     */
    constructor(messageRepo, userRepo) {
        this.messageRepo = messageRepo;
        this.userRepo = userRepo;
        console.log('chat service initialzied!');
        autoBind(this);
    }


    /**
     * 
     * @param {string} message 
     * @param {string} userId 
     * @param {string} roomName
     * @returns {Promise<Message>} 
     */
    async createMessage(message, userId, roomName, creationDate) {
        console.log({ message, userId, roomName })
        const msg = Message.build({ creationDate, message, userId, roomName });
        console.log({ messageToCreate: msg })
        console.log({ user: await this.userRepo.findOne({ _id: idResolver(userId) }) });

        const createdMessage = await this.messageRepo.create(msg);

        return createdMessage;
    }

    async getAll(roomName, userId, { pageSize, pageIndex } = {}) {
        const filterCriteria = { $or: [{ roomName }, { userId: idResolver(userId) }] };
        const count = await this.messageRepo.count(filterCriteria);

        const redisCacheCount = 10;
        let skip = (redisCacheCount + (pageSize * pageIndex));
        if (skip > count) {
            skip = redisCacheCount;
        } else {
            skip = count - redisCacheCount;
        }
        if (skip < 0) {
            skip = 0;
        }


        return this.messageRepo.find(filterCriteria, { limit: pageSize, skip, sort: { creationDate: -1 } });
    }

}
