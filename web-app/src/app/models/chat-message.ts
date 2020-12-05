interface ICrateChatMessage {
    message: string;
    userId: string;
    creationDate: Date;
}
export class ChatMessage {
    userId!: string;
    message!: string;
    creationDate!: string;

    static build({ userId, message, creationDate }: ICrateChatMessage): ChatMessage {
        const result = new ChatMessage();
        result.userId = userId;
        result.message = message;
        result.creationDate = creationDate.toJSON();
        return result;
    }
}

