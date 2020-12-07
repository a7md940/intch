const { DuplicateEntityError, NotFoundError } = require('@intch/common');
const { ObjectId } = require('mongodb');

const UserRepository = require('../presistence/repositories/user.repository');
const { User } = require('./../models/user')
module.exports = class UserService {
    /**
     * @private @param {UserRepository} userRepo 
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
        const [existingUser, existingEmail] = await Promise.all([
            this.userRepo.findOne({ username: user.username }),
            this.userRepo.findOne({ email: user.email }),
        ]);
        if (existingUser) {
            throw new DuplicateEntityError('createUser:username:exists', 'CUE_0xq');
        }
        if (existingEmail) {
            throw new DuplicateEntityError('createUser:email:exists', 'CEE_0xd');
        }
        const createdUser = await this.userRepo.create(user);
        return createdUser;
    }

    /**
     * Get user by user id.
     * @param {number} userId The user identifier
     * @returns {Promise<User>}
     */
    async getById(userId) {
        return this.userRepo.findOne({ _id: ObjectId(userId) });
    }

    /**
     * Get user by user email address.
     * @param {string} email The user Email address.
     * @returns {Promise<User>}
     */
    async getUserByEmail(email) {
        const user = await this.userRepo.findOne({ email });
        return user;
    }

    /**
     * Updates a user.
     * @param {string} userId User identifier
     * @param {Partial<User>} data User data to update
     */
    async updateUser(userId, data) {
        const user = await this.getById(userId);
        if (!user) {
            // User not found to update
            throw new NotFoundError('User not found', 'UNFTUD8f');
        }
        delete user._id;
        delete user.id;
        const dataToUpdate = { ...user, ...data };
        await this.userRepo.updateOne(userId, dataToUpdate);
        return this.getById(userId);
    }

    async getUserByUsername(username) {
        return this.userRepo.findOne({ username })
    }
}