
const { PagedList, autoBind } = require('@intch/common/utils');
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
        const msg = Message.build({ creationDate, message, userId, roomName });

        const [createdMessage, user] = await Promise.all([
            this.messageRepo.create(msg),
            this.userRepo.findOne({ userId: idResolver(userId) })
        ]);
        createdMessage.user = user;
        return createdMessage;
    }

    async getAll(roomName, userId, { pageIndex } = {}) {
        const PAGE_SIZE = 10;
        const filterCriteria = { $or: [{ roomName }, { userId: idResolver(userId) }] };
        let skip = PAGE_SIZE * pageIndex;

        let [messages, count] = await Promise.all([
            this.messageRepo.find(filterCriteria, { limit: PAGE_SIZE, skip, sort: { creationDate: -1 } }),
            this.messageRepo.count(filterCriteria)
        ]);
        messages = messages.sort((a, b) => new Date(a.creationDate).getTime() - new Date(b.creationDate).getTime());

        /**
         * @type {PagedList<Message>}
         */
        const result = PagedList.build({
            collection: messages.map(Message.build),
            count,
            pageSize: PAGE_SIZE,
            pageIndex
        });
        return result;
    }

}
