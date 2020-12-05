const { ObjectId } = require('mongodb');

module.exports = (val) => {
    if (process.env.DB_TYPE && process.env.DB_TYPE != 'mongodb') {
        return val;
    } else {
        return ObjectId(val);
    }
}