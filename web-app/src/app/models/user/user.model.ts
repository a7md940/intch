interface IUser {
    id?: string;
    username: string;
    email: string;
}

export class User {
    id?: string;
    username: string;
    email: string;

    constructor({ id, username, email }: IUser) {
        if (id) {
            this.id = id;
        }
        this.username = username;
        this.email = email;
    }
}
