const { User } = require('./../../models/user');
const { Db } = require('mongodb');

module.exports = class UserRepository {
    /**
     * 
     * @param {Db} db 
     */
    constructor(db) {
        this.User = db.collection('users');
    }


    /**
     * Creates new user in `User collection`.
     * @param {User} data user data to create.
     * @returns {Promise<User>}
     */
    create(data) {
        return new Promise((resolve, reject) => {
            this.User.insertOne(data, async (err, result) => {
                if (err) {
                    reject(err);
                }
                const [createdUser] = result.ops;
                console.log(await this.User.findOne({ _id: createdUser._id }))
                resolve(createdUser)
            })
        });
    }
}