export class UserAuth {
    token!: string;
    refreshToken!: string;
    userId!: string;

    static build({ token, refreshToken, userId }: UserAuth): UserAuth {
        const result = new UserAuth();
        result.token = token;
        result.refreshToken = refreshToken;
        result.userId = userId;
        return result;
    }
}
