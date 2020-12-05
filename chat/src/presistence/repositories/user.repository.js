const { User } = require('./../../models');
const { Db, ObjectId } = require('mongodb');

module.exports = class UserRepository {
    /**
     * @param {Db} db 
     */
    constructor(db) {
        /** @type {import('mongodb').Collection<User>} */
        this.User = db.collection('users');
    }

    async getByUsername(username) {
        const user = await this.User.findOne({ username });
        return user;
    }

    /**
     * Find one record of user using filter criteria.
     * @param {import('mongodb').FilterQuery<User>} where
     * @param {import('mongodb').FindOneOptions<User>} options
     */
    findOne(where, options = null) {
        return this.User.findOne(where, options)
            .then(x => {
                if (x) {
                    x.id = x._id;
                    delete x._id;
                    return x;
                }
                return null;
            });
    }

    /**
     * Creates new user in `User collection`.
     * @param {User} data user data to create.
     * @returns {Promise<User>}
     */
    create(data) {
        return new Promise((resolve, reject) => {
            this.User.insertOne(payload, async (err, result) => {
                if (err) {
                    return reject(err);
                }
                const [createdUser] = result.ops;
                createdUser.id = createdUser._id;
                delete createdUser._id;
                resolve(createdUser);
            })
        });
    }
    /**
     * Updates an existing user
     * @param {string} userId User identifier
     * @param {User} data User data to update
     * @returns {Promise<User>} promise of updated user result.
     */
    updateOne(userId, data) {
        return this.User.updateOne({ _id: ObjectId(userId) }, { $set: data });
    }
}