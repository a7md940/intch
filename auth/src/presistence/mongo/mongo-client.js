const { Db, C } = require('mongodb');
const MongoClient = require('mongodb').MongoClient;

const repos = require('./schema');

const clientProp = Symbol('client');
class MongoManager {
    /** @type {MongoClient} */
    [clientProp] = null;

    repos = [];

    /**
     * Connect to mongodb server
     * @param {string} url The mongodb URI Connection string.
     * @returns {Promise<Db>}
     */
    connect(url) {
        return new Promise((resolve, reject) => {
            MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
                if (err) {
                    reject(err);
                    return;
                }
    
                console.log('Connected Sucessfully with Database');
                this[clientProp] = client;
    
                this.db = this[clientProp].db('auth');
                resolve(this.db);
            });
        })
    }

    getClient() {
        return this[clientProp];
    }

    buildRepos() {
        if (!this.getClient() || !this.db) {
            throw new Error('Conenction must be established');
        }
        for (const repoFactory of repos) {
            repoFactory(this);
        }
    }

    /**
     * Get collection by name
     * @param {string} collectionName Collection name
     * @returns {Promise<import('mongodb').Collection | null>}
     */
    async getCollection(collectionName) {
        const collections = await this.db.listCollections().toArray();
        const existingCollectopn = collections.find(x => x.name == collectionName);
        if (!existingCollectopn) {
            return null;
        }

        return this.db.collection(collectionName);
    }
}

module.exports = new MongoManager();