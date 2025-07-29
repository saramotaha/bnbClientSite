import { Component } from '@angular/core';
import { MessageList } from './sidebar/message-list';
import { CommonModule } from '@angular/common';
import { ChatWindow } from "./chat/chat-window";

@Component({
  selector: 'app-messages',
  standalone:true,
  imports: [CommonModule, MessageList, ChatWindow],
  templateUrl: './messages.html',
  styleUrls: ['./messages.css']
})
export class Messages {
  selectedConversationId!:number;
  onConvoSelected(id:number){
    console.log('Conversation selected' ,id);
    this.selectedConversationId=id;
  }
}
