const awilix = require('awilix');

const NatsWrapper = require('./nats-wrapper');
const { getDbInstance } = require('./presistence/db');
const { RedisManager } = require('./utils/redis');

const { UserService, AuthService, EmailService } = require('./services');
const { AuthController, VerificationController } = require('./controllers');

const { UserRepository } = require('./presistence/repositories');

const { ForgotPasswordDtoPipe, CreateUserDtoPipe } = require('./middlewares/validator-pipes');

const { SendGridGateway } = require('./gateways');


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
        forgotPasswordDtoPipe: awilix.asClass(ForgotPasswordDtoPipe),

        authService: awilix.asClass(AuthService),
        userService: awilix.asClass(UserService),
        emailService: awilix.asClass(EmailService),

        userRepo: awilix.asClass(UserRepository),
    });
}

module.exports = { setupDi, container };