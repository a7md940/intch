const { Message } = require('./../../models');
const { Db, ObjectId } = require('mongodb');

module.exports = class MessageRepository {
    /**
     * @param {Db} db 
     */
    constructor(db) {
        /** @type {import('mongodb').Collection<Message>} */
        this.Message = db.collection('messages');
    }

    /**
     * @param {import('mongodb').FilterQuery<Message>} filter
     * @param {import('mongodb').FindOneOptions<Message>} options
     * @returns {Promise<Message[]>} Messages array.
     */
    find(filter, options = null) {
        return this.Message.find(filter, options)
            .toArray()
    }


    /**
     * @param {FilterQuery<Message>} query
     * @param {MongoCountPreferences} options
     * 
     */
    count(query, options = null) {
        return this.Message.countDocuments(query, options)
    }

    /**
     * Find one record of Message using filter criteria.
     * @param {import('mongodb').FilterQuery<Message>} where
     * @param {import('mongodb').FindOneOptions<Message>} options
     */
    findOne(where, options = null) {
        return this.Message.findOne(where, options)
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
     * Creates new Message in `Message collection`.
     * @param {Message} data Message data to create.
     * @returns {Promise<Message>}
     */
    create(data) {
        data.userId = ObjectId(data.userId);

        return new Promise((resolve, reject) => {
            this.Message.insertOne(data, async (err, result) => {
                if (err) {
                    return reject(err);
                }
                const [createdMessage] = result.ops;
                createdMessage.id = createdMessage._id;
                delete createdMessage._id;
                resolve(createdMessage);
            })
        });
    }
    /**
     * Updates an existing Message
     * @param {string} messageId Message identifier
     * @param {Message} data Message data to update
     * @returns {Promise<Message>} promise of updated Message result.
     */
    updateOne(messageId, data) {
        return this.Message.updateOne({ _id: ObjectId(messageId) }, { $set: data });
    }
}