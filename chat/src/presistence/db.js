const config = require('../config');
const mongoManager = require('./mongo/mongo-client');

const getDbInstance = async () => {
    const db = await mongoManager.connect(config.db.mongoURI);
    mongoManager.buildRepos();
    return db;
}
module.exports = { getDbInstance };
