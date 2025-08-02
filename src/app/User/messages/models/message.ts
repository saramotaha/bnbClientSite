export interface Message {
  id?: number;
  conversationId: number;
  content: string;
  senderId: number;
  receiverId: number;
  sentAt?: string;
  readAt?: string;
  isCurrentUser?: boolean;
}