const { autoBind, DecodedToken } = require('@intch/common/utils');
const { Server, Socket } = require('socket.io');

const App = require('./../app');
const { MessageRepository } = require('./../presistence/repositories');

class ClientSocket {
    /**
     * 
     * @param {string} userId 
     * @param {Socket} socket 
     */
    constructor(userId, socket) {
        this.userId = userId;
        this.socketId = socket.id;
    }
}
module.exports = class SocketGateway {

    /**
     * 
     * @param {MessageRepository} messageRepo 
     * @param {App} app 
     */
    constructor(messageRepo) {
        this.messageRepo = messageRepo;
        /**
         * @type {ClientSocket[]}
         */
        this.sockets = [];

        autoBind(this);
    }

    /**@param {Server} server */
    setup(server) {
        return new Promise((resolve, reject) => {
            try {
                this.io = new Server(server, {
                    path: '/realtime',
                    transports: ['websocket'],
                });
                console.log('Socket server initialized. on path /realtime')
                this.io.on('connection', (socket) => {
                    this.onConnection(socket);
                    resolve(this.io)
                });
                this.io.on('disconnect', (socket) => this.onDisconnect(socket));
                this.io.on('error', (error) => reject(error));
            } catch (exc) {
                console.error(exc);
                reject(exc);
            }
        });
    }

    /**
     * @param {Socket} socket The socket.io Socket instance
     */
    onConnection(socket) {
        console.log('new Socket client');

        const token = socket.handshake.query.auth;
        const decoded = new DecodedToken(token);
        socket.userId = decoded.userId;
        this.sockets.push(new ClientSocket(decoded.userId, socket));

    }

    onDisconnect(socket) {
        const token = socket.handshake.query.auth;
        const decoded = new DecodedToken(token);
        socket.userId = decoded.userId;
        console.log('disconnected user', socket.userId)
        this.sockets = this.sockets.filter(x => x.userId == decoded.userId && x.socketId == socket.id);
    }

    /**
     * 
     * @param { (clientSocket: ClientSocket) => boolean } cb 
     * @returns {Socket[]}
     */
    filterSockets(cb) {
        return this.sockets
            .filter(x => cb(x))
            .map(x => this.io.sockets.sockets.get(x.socketId))
            .filter(x => x != null);
    }


}
