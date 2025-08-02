import { ConversationService } from './../sidebar/conversation.service';
import { Conversation } from './../models/conversation';
import { Component, Input, OnChanges, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { messageService } from './message.service';
import { SignalRService } from '../core/signalr.service';
import { Subscription } from 'rxjs';

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
  private cdr: ChangeDetectorRef
){
  this.initializeSignalR();
};
private initializeSignalR(): void {
    this.signalRservice.startConnection().then(() => {
      this.signalRservice.onReceiveMessage((message) => {
        if (message.conversationId === this.conversationId && this.conversation) {
          // Add the new message to the conversation
          this.conversation.messages = [...(this.conversation.messages || []), message];
        }
      });

      this.signalRservice.onConnectionStatusChanged((status) => {
        console.log(`SignalR connection status: ${status}`);
      });
    }).catch(err => {
      console.error('Error establishing SignalR connection:', err);
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

sendMessage(){
  const trimmed =this.newMessageContent.trim();
  if(!trimmed||!this.conversationId)return;

  const dto={
    content:trimmed,
    senderId:1,
    receiverId:this.conversation?.participantId??2,
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
}
