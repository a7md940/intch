const awilix = require('awilix');
const { UserService, AuthService } = require('./services');
const { AuthController, VerificationController } = require('./controllers');
const { UserRepository } = require('./presistence/repositories');
const { getDbInstance } = require('./presistence/db');
const { CreateUserDtoPipe } = require('./middlewares/validator-pipes');
const { RedisManager } = require('./utils/redis');
const { SendGridGateway } = require('./gateways');
const NatsWrapper = require('./nats-wrapper');

const container = awilix.createContainer({
    injectionMode: awilix.InjectionMode.CLASSIC
});

const setupDi = async () => {
    const db = await getDbInstance();

    return container.register({
        db: awilix.asValue(db, { lifetime: awilix.Lifetime.SINGLETON }),
        redis: awilix.asClass(RedisManager, { lifetime: awilix.Lifetime.SINGLETON }),
        sendGridGateway: awilix.asClass(SendGridGateway),
        nats: awilix.asClass(NatsWrapper, { lifetime: awilix.Lifetime.SINGLETON }),
        authController: awilix.asClass(AuthController),
        verificationController: awilix.asClass(VerificationController),

        createUserDtoPipe: awilix.asClass(CreateUserDtoPipe),

        authService: awilix.asClass(AuthService),
        userService: awilix.asClass(UserService),

        userRepo: awilix.asClass(UserRepository),
    });
}

module.exports = { setupDi, container };