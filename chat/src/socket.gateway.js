const { autoBind } = require('@intch/common/utils');
const { Server, Socket } = require('socket.io');

module.exports = class SocketGateway {

    constructor() {
        autoBind(this);
    }

    /**@param {Server} server */
    setup(server) {
        try {
            this.io = new Server(server, {
                path: '/realtime',
                transports: ['websocket'],
            });
            console.log('Socket server initialized. on path /realtime')

            this.io.on('connection', (socket) => this.onConnection(socket));
        } catch (exc) {
            console.error(exc);
        }
    }

    /**
     * Handle on client connection
     * @param {Socket} socket The socket.io Socket instance
     */
    onConnection(socket) {
        console.log('new Socket client')
    }
}