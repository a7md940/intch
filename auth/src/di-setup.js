const awilix = require('awilix');
const { UserService, AuthService } = require('./services');
const { AuthController, VerificationController } = require('./controllers');
const { UserRepository } = require('./presistence/repositories');
const { getDbInstance } = require('./presistence/db');
const { CreateUserDtoPipe } = require('./middlewares/validator-pipes');
const { RedisManager } = require('./utils/redis');
const { SendGridGateway } = require('./gateways');

const container = awilix.createContainer({
    injectionMode: awilix.InjectionMode.CLASSIC
});

const setupDi = async () => {
    const db = await getDbInstance();

    container.register({
        db: awilix.asValue(db),
        redis: awilix.asClass(RedisManager),
        sendGridGateway: awilix.asClass(SendGridGateway),

        authController: awilix.asClass(AuthController),
        verificationController: awilix.asClass(VerificationController),

        createUserDtoPipe: awilix.asClass(CreateUserDtoPipe),

        authService: awilix.asClass(AuthService),
        userService: awilix.asClass(UserService),

        userRepo: awilix.asClass(UserRepository),
    });
}

module.exports = { setupDi, container };