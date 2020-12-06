const nats = require('node-nats-streaming');
const config = require('./config/config');

module.exports = class NatsWrapper {

    constructor() { }

    setup() {
        return new Promise((resolve, reject) => {
            const CLIENT_ID = config.appId;
            this.stan = nats.connect('test-cluster', CLIENT_ID, {
                url: config.natsConfig.url,
            });
    
    
            this.stan.on('connect', () => {
                console.log('Listener connected to NATS');
                resolve();
            });
            this.stan.on('error', (error) => {
                reject(error);
            });
        });
    }

    /**
     * 
     * @param {string} subejct 
     * @param {any} payload 
     */
    publish(subejct, payload) {
        this.stan.publish(subejct, JSON.stringify(payload));
    }
}