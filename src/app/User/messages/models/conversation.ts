export interface Conversation {
  id: number;
  user1Id: number;
  user1Name?: string;
  user2Id: number;
  user2Name?: string;
  subject?: string;
  propertyName?: string;
  participantId?:number;
  participantName?: string; // ← اللي هنعمله manually
  messages: {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  sentAt: string;
}[];
}

