const { DuplicateEntityError } = require('@intch/common');
const UserRepository = require('../presistence/repositories/user.repository');

module.exports = class UserService {
    /**
     * @param {UserRepository} userRepo 
     */
    constructor(userRepo) {
        this.userRepo = userRepo;
    }

    /**
     * Creates new user.
     * @param {User} user User data to create new user.
     * @throws {DuplicateEntityError}
     */
    async create(user) {
        const existingUser = await this.userRepo.findOne({
            $or: [
                { email: user.email },
                { username: user.username }
            ]
        });
        if (existingUser) {
            throw new DuplicateEntityError('createUser:username:exists')
        }
        const createdUser = await this.userRepo.create(user);
        return createdUser;
    }
}
