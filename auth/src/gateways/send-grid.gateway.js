const nodemailer = require('nodemailer');
const config = require('../config/config');

module.exports = class SendGridGateway {
    constructor() {
        this.client = nodemailer.createTransport({
            host: config.sendGrid.host,
            port: config.sendGrid.port,
            auth: {
                user: config.sendGrid.auth.user,
                pass: config.sendGrid.auth.password
            }
        });
    }

    sendEmail(from, to, subject, htmlTemplate) {
        return this.client.sendMail({
            from,
            to,
            subject,
            html: htmlTemplate
        });
    }
}