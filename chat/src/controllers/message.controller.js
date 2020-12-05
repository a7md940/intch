const { autoBind } = require('@intch/common/utils');

const ChatService = require('../services/chat.service');
const RedisManager = require('../utils/redis/redis-manager');
const { SocketGateway } = require('./../gateway');

module.exports = class MessageController {
    /**
     * @private @param {SocketGateway} socketGateway 
     * @private @param {RedisManager} redis 
     * @private @param {ChatService} chatService Message repository
     */
    constructor(chatService, socketGateway, redis) {
        this.chatService = chatService;
        this.socketGateway = socketGateway;
        this.redis = redis;
        autoBind(this);
    }

    async createMessage(req, res, next) {
        const messageDto = req.body;
        const { roomName, creationDate, message } = messageDto;
        messageDto.userId = req.currentUser.id;

        this.socketGateway
            .filterSockets((socket) => socket.userId != req.currentUser.id)
            .forEach((sock) => sock.emit(roomName, messageDto));
        const createdMessage = await this.chatService.createMessage(message, req.currentUser.id, roomName, creationDate);

        this._storeToTopTenMessages(roomName, createdMessage);

        res.status(201)
            .send(createdMessage);
    }

    async getAll(req, res, next) {
        const { roomName, topTen, pageSize, pageIndex } = req.query;
        const currentUserId = req.currentUser.id;
        if (topTen) {
            const topTenMessages = await this.redis.get(`latest:messages:${roomName}`);
            if (Array.isArray(topTenMessages) && topTenMessages.length > 0) {
                return res.status(200)
                    .send(topTenMessages)
            }
        }
        const messages = await this.chatService.getAll(roomName, currentUserId, { pageSize: +pageSize, pageIndex: +pageIndex });
        res.send(messages);
    }

    _storeToTopTenMessages(roomName, message) {
        const key = `latest:messages:${roomName}`;
        this.redis.get(key)
            .then(async (val) => {
                if (!val) {
                    this.redis.set(key, [message]);
                } else {
                    const top10LatestMessages = await this.redis.get(key);
                    if (top10LatestMessages.length == 10) {
                        top10LatestMessages.splice(0, 1);
                    }
                    this.redis.set(key, [...top10LatestMessages, message]);
                }
            });
    }
}