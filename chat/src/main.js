const App = require('./app');
const { container, setupDi } = require('./di-setup');
const { SocketGateway } = require('./gateway');

const bootstrap = async () => {
    try {
        await setupDi();

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
