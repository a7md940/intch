const mongoManager = require('./../../mongo-client');

const COLLECTION_NAME = 'messages';

/**
 * 
 * @param {typeof mongoManager} mongoManager 
 */
module.exports = UserSchemaFactory = async mongoManager => {
    const Message = await mongoManager.getCollection(COLLECTION_NAME)
    if (Message) {
        return Message;
    }

    return mongoManager.db.createCollection(COLLECTION_NAME, {
        validationLevel: 'strict',
        validationAction: 'error',
        validator: {
            $jsonSchema: {
                bsonType: 'object',
                required: ['message', 'userId', 'creationDate', 'roomName'],
                properties: {
                    message: {
                        bsonType: 'string',
                    },
                    userId: {
                        bsonType: 'objectId',
                        description: 'Must be email and is required'
                    },
                    creationDate: {
                        bsonType: ['date'],
                    },
                    roomName: {
                        bsonType: ['string', 'null'],
                    }, 
                }
            }
        }
    });
};
