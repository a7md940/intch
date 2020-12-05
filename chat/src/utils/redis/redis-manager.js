const redis = require('redis');
const { promisify } = require('util');
const { autoBind } = require('@intch/common/utils');

const config = require('./../../config');
const client = redis.createClient(config.redis);

client.on('error', function (error) {
    console.error(error);
});
const set = promisify(client.set).bind(client);
const del = promisify(client.del).bind(client);
const get = promisify(client.get).bind(client);

module.exports = class RedisManager {

    constructor() {
        autoBind(this);
    }

    /**
     * 
     * @param {string} key 
     * @param {any} value 
     * @returns {Promise<any>}
     */
    set(key, value) {
        if (typeof value !== 'string') {
            value = JSON.stringify(value);
        }
        return set(key, value);
    }
    /**
     * 
     * @returns {Promise<null | any>} 
     */
    async get(key) {
        const data = await get(key);
        return JSON.parse(data);
    }
    add(key, value, expireAt = null) {
        return new Promise((resolve, reject) => {
            if (typeof value !== 'string') {
                value = JSON.stringify(value);
            }
            if (expireAt != null) {
                const expireTime = expireAt.getTime() - new Date().getTime();
                console.log({ expireTime })
                client.set(key, value, 'PX', expireTime, (err, reply) => {
                    if (err) {
                        reject(err)
                    }
                    resolve(reply);
                })
            } else {
                client.set(key, value, (err, reply) => {
                    if (err) {
                        reject(err)
                    }
                    resolve(reply);
                })
            }
        })
    }
    remove(key) {
        return del(key)
    }
    /**
     * Set expire date time to a redis key to be flushed.
     * @param {string} key key to set expire date time on
     * @param {Date} timestamp date object
     */
    expireKeyIn(key, timestamp) {
        return new Promise(async (resolve, reject) => {
            const val = await this.get(key);
            console.log({ val })
            const time = timestamp.getTime() - new Date().getTime();
            client.expire(key, time, (err, reply) => {
                if (err) {
                    reject(err);
                }
                console.log({ reply })
                resolve(reply);
            })
        });
    }
}