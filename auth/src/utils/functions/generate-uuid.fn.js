const { randomBytes } = require('crypto');

module.exports = (range = 16) => {
    return randomBytes(range).toString('hex')
}