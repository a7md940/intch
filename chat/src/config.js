module.exports = {
    port: process.env.PORT || 8007,
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || '6379'
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'INTouch-app@0.1'
    },
    db: {
        mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017',

    },
    sendGrid: {
        host: process.env.NOTIFICATION_MAIL_HOST || 'smtp.sendgrid.net',
        port: process.env.NOTIFICATION_MAIL_PORT || 587,
        auth: {
            username: process.env.SEND_GRID_USERNAME || 'apikey',
            pass: process.env.SEND_GRID_PASSWORD || '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'
        }
    }
};
