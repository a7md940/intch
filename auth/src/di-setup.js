const awilix = require('awilix');
const { UserService } = require('./services');
const { SignupController } = require('./controllers');
const { UserRepository } = require('./presistence/repositories'); 
const { getDbInstance } = require('./presistence/db');

const container = awilix.createContainer({
    injectionMode: awilix.InjectionMode.CLASSIC
});

const setupDi = async () => {
    const db = await getDbInstance();

    container.register({
        userService: awilix.asClass(UserService),
        [SignupController.diName]: awilix.asClass(SignupController),
        userRepo: awilix.asClass(UserRepository),
        db: awilix.asValue(db),
    });
}

module.exports = { setupDi, container };