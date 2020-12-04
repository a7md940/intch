const mongoManager = require('./mongo/mongo-client');

const getDbInstance = async () => {
    const db = await mongoManager.connect(process.env.MONGO_URI);
    mongoManager.buildRepos();
    return db;
}
module.exports = { getDbInstance };
