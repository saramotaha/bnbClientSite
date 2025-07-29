import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Conversation } from '../models/conversation';
import { ConversationService } from './conversation.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-message-list',
  standalone:true,
  imports: [CommonModule],
  templateUrl:'./message-list.html',
  styleUrls: ['./message-list.css']
})
export class MessageList implements OnInit {
  
@Output() conversationSelected=new EventEmitter<number>();
conversations: Conversation[]=[];
constructor(private convoService:ConversationService){}
ngOnInit(): void {
  const userId=1;
  this.convoService.getUserConversations(userId).subscribe({
    next: convos => {
    console.log('Received conversations:', convos);
    this.conversations = convos;
  },
    error:(err)=>console.error('failed to fetch Conversation',err)
  });
}
selectConversation(convoId:number):void{
  this.conversationSelected.emit(convoId)
}

}
