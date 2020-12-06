const mongoManager = require('./../../mongo-client');

const COLLECTION_NAME = 'users';

/**
 * 
 * @param {typeof mongoManager} mongoManager 
 */
module.exports = UserSchemaFactory = async mongoManager => {
    const User = await mongoManager.getCollection(COLLECTION_NAME)
    if (User) {
        return User;
    }

    return mongoManager.db.createCollection(COLLECTION_NAME, {
        validationLevel: 'strict',
        validationAction: 'error',
        validator: {
            $jsonSchema: {
                bsonType: 'object',
                required: ['username', 'email', 'userId'],
                properties: {
                    username: {
                        bsonType: 'string',
                        description: 'must be a string and is required'
                    },
                    userId: {
                        bsonType: 'objectId',
                    },
                    email: {
                        bsonType: 'string',
                        description: 'Must be email and is required'
                    },
                    password: {
                        bsonType: ['string', 'null'],
                    },
                    verified: {
                        bsonType: ['bool', 'null'],
                    }, 
                }
            }
        }
    });
};
