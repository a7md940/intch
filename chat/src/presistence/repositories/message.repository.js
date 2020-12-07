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
     * @param {QueryOptions} options
     * @returns {Promise<Message[]>} Messages array.
     */
    find(filter, options = null) {
        const addPipeLine = (pipeLineObject, pipeLines) => pipeLineObject ? [...pipeLines, pipeLineObject] : [...pipeLines];
        /**
         * @type {object[]}
         */
        let pipeLines = [{ $match: filter }];
        
        const $sort = options.sort ? { $sort: options.sort } : null;
        pipeLines = addPipeLine($sort, pipeLines);
        
        const $lookkup = {
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: 'userId',
                as: 'user',
            }
        };
        pipeLines = addPipeLine($lookkup, pipeLines);

        const $project = {
            $project: {
                'user.username': 1,
                'user.email': 1,
                message: 1,
                userId: 1,
                creationDate: 1,
                _id: 1,
                roomName: 1
            }
        };
        pipeLines = addPipeLine($project, pipeLines);


        const $skip = options.skip ? { $skip: options.skip } : null;
        pipeLines = addPipeLine($skip, pipeLines);
        
        const $limit = options.limit ? { $limit: options.limit } : null;
        pipeLines = addPipeLine($limit, pipeLines);


        console.dir(pipeLines, { depth: null });
        return this.Message.aggregate(pipeLines)
            .toArray()
            .then(res => res.map(msg => {
                [msg.user] = msg.user;
                return msg;
            })
            );
        // return this.Message.find(filter, options)
        //     .toArray()
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