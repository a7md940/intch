module.exports = class CreateUserDto {
    /** @type {string} */
    username;
    /** @type {string} */
    email;

    /** @returns {CreateUserDto} */
    static toDto(toConvert) {
        const result = new CreateUserDto();
        result.email = toConvert.email;
        result.username = toConvert.username;
        return result;
    }
}