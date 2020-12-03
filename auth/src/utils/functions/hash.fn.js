const { createHash } = require('crypto');
const config = require('../../config/config');

/**
 * Hashing string
 * @param {string} str Value to hash
 */
module.exports = (str) => {
    return createHash(config.hashAlgo)
        .update(str)
        .digest('hex');
}