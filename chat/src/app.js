const bodyParser = require('body-parser');
const express = require('express');
const { autoBind } = require('@intch/common/utils');
const { Server, createServer } = require('http');
const cors = require('cors');

const config = require('./config');
module.exports = class App {
    constructor() {
        /**
         * @type {import('express').Express}
         */
        this.expressInstance = express();
        /**
         * @type {Server}
         */
        this.server = createServer(this.expressInstance);
        autoBind(this);

    }

    setup() {

        this.expressInstance.use(cors());
        this.expressInstance.use(bodyParser.json());
        this.expressInstance.use(bodyParser.urlencoded({ extended: true }));
        this.expressInstance.get('/health', (req, res) => res.send('ok'))

        const messageRouter = require('./routers/message.router');
        this.expressInstance.use('/message', messageRouter);

        this.server.listen(config.port, () => {
            console.log('App listening on port ', config.port);
        });
        process.on('exit', () => {
            console.log('closing the server.')
            this.server.close();
        })
    }
}