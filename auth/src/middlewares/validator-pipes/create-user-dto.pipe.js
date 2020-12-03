const { ParameterError } = require('@intch/common');

const CreateUserDto = require('../../dtos/user/create-user.dto');

const isEmail = (val) => true;

module.exports = class CreateUserDtoPipe {
    static diName = 'createUserDtoPipe';
    constructor() { }

    /**@returns {CreateUserDto} */
    transform = (value) => {
        if (!value.username) {
            throw new ParameterError(['username'], 'createUser:usernameIsRequired');
        } else if (typeof value.username != 'string') {
            throw new ParameterError(['username'], 'createUser:usernameMustBeString');
        }

        if (!value.email) {
            throw new ParameterError(['email'], 'createUser:emailIsRequired');
        } else if (typeof value.email != 'string') {
            throw new ParameterError(['email'], 'createUser:emailMustBeString');
        } else if (!isEmail(value.email)) {
            throw new ParameterError(['email'], 'createUser:invalidEmail');
        }

        const username = value.username.trim();
        const email = value.email;
        return CreateUserDto.toDto({ username, email });
    }
}