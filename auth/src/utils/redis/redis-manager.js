const config = require('./../../config/config');
const redis = require('redis');
const client = redis.createClient(config.redisConfig);
const { promisify } = require('util');

client.on('error', function (error) {
    console.error(error);
});

const set = promisify(client.set).bind(client);
const del = promisify(client.del).bind(client);
const get = promisify(client.get).bind(client);
const hset = promisify(client.hset).bind(client);

/**
 * @type { {
 *  get: (key: string) => Promise<any>;
 *  add: (key: string, value: any) => Promise<any>;
 *  remove: (key: string) => Promise<any>;
 *  hset: typeof client['hset']
 *  } }
 */
const redisStorage = {
    get: (key) => {
        return get(key);
    },
    add: (key, value) => {
        if (typeof value !== 'string') {
            value = JSON.stringify(value);
        }
        return set(key, value)
    },
    remove: (key) => {
        return del(key)
    },
    hset
};

module.exports = redisStorage;