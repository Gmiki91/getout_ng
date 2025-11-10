import { Visitor } from "./user.model";

export type Message = {
    id: string;
    sender: Visitor;
    receiver: Visitor;
    text: string;
    timestamp: string;
    isRead: boolean;
}
export type NewMessageData = {
    text: string;
    timestamp: string;
    senderId: string;
    receiverId: string;
}