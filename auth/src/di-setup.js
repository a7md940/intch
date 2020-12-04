const awilix = require('awilix');
const { UserService, AuthService } = require('./services');
const { AuthController } = require('./controllers');
const { UserRepository } = require('./presistence/repositories');
const { getDbInstance } = require('./presistence/db');
const { CreateUserDtoPipe } = require('./middlewares/validator-pipes');
const { redisStorage } = require('./utils/redis');
const { SendGridGateway } = require('./gateways');

const container = awilix.createContainer({
    injectionMode: awilix.InjectionMode.CLASSIC
});

const setupDi = async () => {
    const db = await getDbInstance();

    container.register({
        db: awilix.asValue(db),
        redis: awilix.asValue(redisStorage),
        sendGridGateway: awilix.asClass(SendGridGateway),

        authController: awilix.asClass(AuthController),

        createUserDtoPipe: awilix.asClass(CreateUserDtoPipe),

        authService: awilix.asClass(AuthService),
        userService: awilix.asClass(UserService),

        userRepo: awilix.asClass(UserRepository),
    });
}

module.exports = { setupDi, container };