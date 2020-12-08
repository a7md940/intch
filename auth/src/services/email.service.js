const { autoBind } = require("@intch/common/utils")

module.exports = class EmailService {

    constructor() {
        autoBind(this);
    }

    buildForgorTemplate(username, code, localeId = 'en-US') {
        return `
            <html>
                <body>
                    <h1>
                        Reset password code:
                    </h1>
                    <p> ${code} </p>
                </body>
            </html>
        `;
    }
}