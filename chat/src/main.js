const nats = require('node-nats-streaming');
const config = require('./config');
const App = require('./app');
const { container, setupDi } = require('./di-setup');
const { SocketGateway } = require('./gateway');
const autoBind = require('@intch/common/utils/auto-bind');
const { Listener } = require('@intch/common/utils');
const idResolver = require('./presistence/id-resolver');
const bootstrap = async () => {
    try {
        await setupDi();
        const CLIENT_ID = config.appId;
        const stanClient = nats.connect('test-cluster', CLIENT_ID, {
            url: 'nats://intch.nats:4222'
        });
        const userRepo = container.resolve('userRepo');
        stanClient.on('connect', () => {
            const createdUserListener = new Listener(stanClient, 'user:created', 'chat-srv-group');
            createdUserListener.onMessage = async (data, msg) => {
                await userRepo.create(data);
                msg.ack();
            };
            createdUserListener.listen();

            const userVerifiedListener = new Listener(stanClient, 'user:verified', 'chat-srv-group');
            userVerifiedListener.onMessage = async (data, msg) => {
                const userId = data.id;

                await userRepo.updateOne(userId, { verified: true });

                msg.ack();
            };
            userVerifiedListener.listen();
        });

        /** @instance @type {SocketGateway} */
        const socket = container.resolve('socketGateway');
        /** @instance @type {App} */
        const app = container.resolve('app');
        socket.setup(app.server);
        app.setup();

    } catch (exc) {
        console.error(exc);
    }

};

bootstrap();
