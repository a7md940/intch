const awilix = require('awilix');
const { getDbInstance } = require('./presistence/db');
const { RedisManager } = require('./utils/redis');
const App = require('./app');
const { SocketGateway } = require('./gateway');
const { MessageRepository, UserRepository } = require('./presistence/repositories');
const { MessageController } = require('./controllers');
const { ChatSerivce } = require('./services');

const container = awilix.createContainer({
    injectionMode: awilix.InjectionMode.CLASSIC
});

const setupDi = async () => {
    const db = await getDbInstance();
    container.register({

        db: awilix.asValue(db, { lifetime: awilix.Lifetime.SINGLETON }),
        redis: awilix.asClass(RedisManager, { lifetime: awilix.Lifetime.SINGLETON }),
        socketGateway: awilix.asClass(SocketGateway, { lifetime: awilix.Lifetime.SINGLETON }),
        app: awilix.asClass(App, { lifetime: awilix.Lifetime.SINGLETON }),

        // services
        chatService: awilix.asClass(ChatSerivce),

        // controllers
        messageController: awilix.asClass(MessageController),

        // repositories.
        messageRepo: awilix.asClass(MessageRepository),
        userRepo: awilix.asClass(UserRepository),

    });

}

module.exports = { setupDi, container };