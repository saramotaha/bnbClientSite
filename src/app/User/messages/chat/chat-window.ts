import { ConversationService } from './../sidebar/conversation.service';
import { Conversation } from './../models/conversation';
import { Component, Input, OnChanges, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { messageService } from './message.service';
import { SignalRService } from '../core/signalr.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../Pages/Auth/auth.service';

@Component({
  selector: 'app-chat-window',
  standalone:true,
  imports: [CommonModule,FormsModule],
  templateUrl: './chat-window.html',
  styleUrl: './chat-window.css'
})
export class ChatWindow implements OnChanges ,OnDestroy {
@Input() conversationId!:number;
conversation?:Conversation;
newMessageContent='';
isSending=false;
private signalRSubscription?:Subscription;
constructor(private conversationService:ConversationService,
  private messageservise:messageService,
  private signalRservice :SignalRService,
  private cdr: ChangeDetectorRef,
  private authService: AuthService
){
  this.initializeSignalR();
};
private initializeSignalR(): void {
  this.signalRservice.startConnection().then(() => {
    this.signalRservice.onReceiveMessage((message: any) => {
      console.log('Raw received message:', message);
      
      const processedMessage = {
        id: message.id,
        content: message.content,
        senderId: message.senderId,
        receiverId: message.receiverId,
        conversationId: message.conversationId,
        sentAt: message.sentAt,
        isCurrentUser: message.senderId === Number(this.authService.getUserId())
      };

      if (processedMessage.conversationId === this.conversationId) {
        if (!this.conversation) {
          console.warn('No conversation loaded');
          return;
        }
        
        // Add the message and sort by timestamp
        this.conversation.messages = [
          ...(this.conversation.messages || []),
          processedMessage
        ].sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime());
        
        this.cdr.detectChanges();
      }
    });
  }).catch(err => {
    console.error('SignalR connection error:', err);
  });
}
  ngOnChanges(): void {
    if (this.conversationId > 0) {
      // Leave previous conversation if exists
      if (this.conversation?.id) {
        this.signalRservice.leaveConversation(this.conversation.id);
      }
      // Join new conversation
      this.signalRservice.joinConversation(this.conversationId);
      
      // Load conversation details
      this.conversationService.getConversationDetails(this.conversationId).subscribe({
        next: (data: Conversation) => {
          if (data && typeof data === 'object' && 'subject' in data) {
            this.conversation = data;
          } else {
            console.warn('⚠️ Unexpected conversation format:', data);
          }
        },
        error: (err: any) => console.error('Error Loading Conversation', err)
      });
    }
  }
 ngOnDestroy(): void {
    if (this.conversationId) {
      this.signalRservice.leaveConversation(this.conversationId);
    }
    if (this.signalRSubscription) {
      this.signalRSubscription.unsubscribe();
    }
  }
  isMessageFromCurrentUser(message: any): boolean {
  const currentUserId = Number(this.authService.getUserId());
  return message.senderId === currentUserId;
}

sendMessage(){
  const trimmed =this.newMessageContent.trim();
  if(!trimmed||!this.conversationId|| !this.conversation)return;

  const currentUserId=this.authService.getUserId();
  if(!currentUserId)  return;

 
  const dto={
    content:trimmed,
    senderId:(Number(currentUserId)),
    receiverId:(this.getOtherParticipant(Number(currentUserId))),
    conversationId:this.conversationId
  };
  this.isSending=true;
  this.messageservise.sendMessage(dto).subscribe({
    next:()=>{
      this.newMessageContent='';
      this.isSending=false;
    },
    error:(err)=>{
      console.error('failed to send message:',err);
      if(err.error){
        console.error('server response: ',err.error);
      }
      this.isSending=false;
      
    }
  });
}
private getOtherParticipant(currentUserId: number): number {
  if (!this.conversation) return 0;
  return this.conversation.user1Id === currentUserId
    ? this.conversation.user2Id
    : this.conversation.user1Id;
}
}