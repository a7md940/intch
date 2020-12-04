module.exports = class CreateUserDto {
    
    /** @returns {CreateUserDto} */
    static toDto(toConvert) {
        const result = new CreateUserDto();
        /** @type {string} */
        result.email = toConvert.email;
        /** @type {string} */
        result.username = toConvert.username;
        return result;
    }
}