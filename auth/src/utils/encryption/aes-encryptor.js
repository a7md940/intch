const { createCipheriv, createDecipheriv, scryptSync, randomBytes } = require('crypto');
const config = require('../../config/config');
const Rfc2898DeriveBytes = require('./rfc-derived-bytes');

const _key = Symbol('key');
const _iv = Symbol('iv');
const _alog = Symbol('alog');

module.exports = class AesEncryptor {


    constructor() {
        /** @type {Buffer} */
        this[_key] = scryptSync(Buffer.from(config.encyptionKey), Buffer.alloc(5, 0), 16);
        /** @type {Buffer} */
        this[_iv] = randomBytes(16);
        /** @type {string} */
        this[_alog] = 'aes-128-cbc';

        this.IVLen = 16;
        this.keyLen = 32;
        this.algorithm = 'aes-256-cbc';
        this.key = config.encyptionKey;
        this.salt = Buffer.from([0x49, 0x76, 0x61, 0x6e, 0x20, 0x4d, 0x65, 0x64, 0x76, 0x65, 0x64, 0x65, 0x76]);
        this.pdb = new Rfc2898DeriveBytes(this.key, this.salt);
        this.nodeCrypto = this.pdb.getBytes(this.keyLen + this.IVLen);
    }



    /**
     * Enrypts strings using 'aes-128-cbc' algorithm
     * @param {string} value String to encrypt.
     */
    encryptString(value) {
        try {
            const { nodeCrypto, keyLen, IVLen, algorithm } = this;
            const key = nodeCrypto.slice(0, keyLen);
            const iv = nodeCrypto.slice(keyLen, keyLen + IVLen);
            const cipher = createCipheriv(algorithm, key, iv);
            let decrypted = cipher.update(value, 'utf8', 'hex')
            decrypted += cipher.final('hex');

            return decrypted;
        } catch (err) {
            console.error(err);
        }
    }
    /**
     * Decrypts encrypted strings using 'aes-128-cbc' algorithm
     * @param {string} encrypted String to decrypt.
     */
    decryptString(encrypted) {
        try {
            const { nodeCrypto, keyLen, IVLen, algorithm } = this;
            const key = nodeCrypto.slice(0, keyLen);
            const iv = nodeCrypto.slice(keyLen, keyLen + IVLen);
            const decipher = createDecipheriv(algorithm, key, iv);
            let decrypted = decipher.update(encrypted, 'hex', 'utf8')
            decrypted += decipher.final('utf8');
            return decrypted;
        } catch (err) {
            console.error(err);
        }
    }
}