module.exports = class CreateUserDto {

    /** @returns {CreateUserDto} */
    static toDto(toConvert) {
        const result = new CreateUserDto();
        /** @type {string} */
        result.email = toConvert.email;
        /** @type {string} */
        result.username = toConvert.username;

        result.verified = toConvert.verified;
        result.password = toConvert.password;
        return result;
    }
}