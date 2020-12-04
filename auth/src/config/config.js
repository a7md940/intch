const { hostname } = require('os');
const { generateUUID } = require('../utils/functions');

const config = {
    port: process.env.PORT || 8000,
    appEmail: process.env.APP_EMAIL || 'in.touch.supprt@gmail.com',
    appId: `auth-${hostname()}-${generateUUID()}`,
    jwt: {
        secret: process.env.JWT_KEY || 'INTouch-app@0.1',
        tokenExpiresIn: process.env.TOKEN_EXP_IN_MINUTES ? `${process.env.TOKEN_EXP_IN_MINUTES}m` : '5m',
        refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXP_IN_MINUTES ? `${process.env.REFRESH_TOKEN_EXP_IN_MINUTES}m` : '120m',
    },
    redisConfig: {
        port: process.env.REDIS_PORT || '6379',
        host: process.env.REDIS_HOST || 'localhost'
    },
    sendGrid: {
        host: process.env.NOTIFICATION_MAIL_HOST || 'smtp.sendgrid.net',
        port: process.env.NOTIFICATION_MAIL_PORT || 587,
        auth: {
            user: process.env.SEND_GRID_USERNAME || 'apikey',
            password: process.env.SEND_GRID_PASSWORD || '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'
        }
    },
    hashAlog: process.env.HASH_ALOG || 'md5',
    encyptionKey: process.env.ENC_KEY || '@EDFCGHHzar4w',
};
module.exports = config;
