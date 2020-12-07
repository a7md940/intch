import { User } from './user';
interface ICrateChatMessage {
    message: string;
    userId: string;
    creationDate: Date;
    user?: User;
}
export class ChatMessage {
    userId!: string;
    message!: string;
    creationDate!: string;
    user!: User;

    static build({ user, userId, message, creationDate }: ICrateChatMessage): ChatMessage {
        const result = new ChatMessage();
        result.userId = userId;
        result.message = message;
        result.creationDate = creationDate.toJSON();
        if (user) {
            result.user = user;
        }
        return result;
    }
}

