const { ParameterError } = require('@intch/common');
const { autoBind } = require('@intch/common/utils')
const { ForgotPasswordDto } = require('./../../dtos');

module.exports = class ForgotPasswordDtoPipe {
    constructor() {
        autoBind(this);
    }
    transform(reqBody) {
        const { email } = reqBody;
        if (email == null) {
            throw new ParameterError(['email'], 'forgotPassword:emailIsRequired', null, 'FGPERQ_02mf');
        }
        return new ForgotPasswordDto(email);
    }
}
