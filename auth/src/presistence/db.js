const mongoManager = require('./mongo/mongo-client');

const getDbInstance = async () => {
    const db = await mongoManager.connect('mongodb://localhost:27017');
    mongoManager.buildRepos();
    return db;
}
module.exports = { getDbInstance };
