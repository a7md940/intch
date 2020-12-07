
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

    async getAll(roomName, userId, { pageIndex } = {}, withTopTen = true) {
        const PAGE_SIZE = 10;
        const filterCriteria = { $or: [{ roomName }, { userId: idResolver(userId) }] };
        const count = await this.messageRepo.count(filterCriteria);
        const redisCacheCount = 10;
        let skip = 0;

        if (PAGE_SIZE > 0 && pageIndex > 0) {
            skip = (redisCacheCount + (PAGE_SIZE * pageIndex));
        }

        if (withTopTen) {
            if (skip > count) {
                skip = skip - count;
            } else {
                skip = skip - redisCacheCount;
            }
        }
        if (skip < 0) {
            skip = 0;
        }

        const messages = await this.messageRepo.find(filterCriteria, { limit: PAGE_SIZE, skip, sort: { creationDate: 1 } });
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
