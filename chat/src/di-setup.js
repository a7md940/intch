const awilix = require('awilix');
const { getDbInstance } = require('./presistence/db');
const { RedisManager } = require('./utils/redis');
const App = require('./app');
const SocketGateway = require('./socket.gateway');

const container = awilix.createContainer({
    injectionMode: awilix.InjectionMode.CLASSIC
});

const setupDi = async () => {
    const db = await getDbInstance();

    container.register({
        db: awilix.asValue(db),
        redis: awilix.asClass(RedisManager),
        app: awilix.asClass(App), 
        socketGateway: awilix.asClass(SocketGateway)
    });
}

module.exports = { setupDi, container };