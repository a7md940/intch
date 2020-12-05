const { excuteHandler, requireAuth } = require('@intch/common/middlewares');
const config = require('../config');
const MessageController = require('../controllers/message.controller');
const { container } = require('./../di-setup');
const messageRouter = require('express').Router();

/**
 * @instane @type {MessageController} 
 */
const messageController = container.resolve('messageController');

messageRouter.get('/', requireAuth(config.jwt.secret), excuteHandler(messageController.getAll));
messageRouter.post('/create', requireAuth(config.jwt.secret), excuteHandler(messageController.createMessage));

module.exports = messageRouter;