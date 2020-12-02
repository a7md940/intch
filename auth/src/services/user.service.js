module.exports = class UserService {
    constructor(userRepo) {
        this.User = userRepo;
    }

    async create(user) {
        console.log(user);
    }
}
