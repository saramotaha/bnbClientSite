import { ChangeDetectorRef, Component, input, Input, OnInit } from '@angular/core';
import { PropertyHostService } from './Service/property-host-service';
import { IHostProperty } from './ihost-property';
import { ConversationService } from '../../../messages/sidebar/conversation.service';
import { messageService } from '../../../messages/chat/message.service';
import { AuthService } from '../../../../Pages/Auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-property-host',
  imports: [],
templateUrl: './property-host.html',
  styleUrl: './property-host.css'
})
export class PropertyHost implements OnInit {
  constructor(private PropertyHostService : PropertyHostService,private cdr :ChangeDetectorRef , private ConvService:ConversationService , MsgService :messageService , private authService :AuthService,
    private router:Router
  ){}
  hostDetails!:IHostProperty
  @Input() hostId!: number;
  @Input() propertyId!: number;
  @Input() userId!:number
  ngOnInit(): void {
    this.PropertyHostService.getHostById(this.hostId).subscribe({
       next: (PropertyHostDetailsRes) => {
          this.hostDetails = PropertyHostDetailsRes;
          console.log('Property details fetched successfully:', PropertyHostDetailsRes); 
              console.log('Host IDDD HERRRRe:', this.hostDetails.firstName);

          this.cdr.detectChanges();
        } ,
        error: (error) => { 
          console.error('Error fetching property details:', error);
        }
      });   
       
  }





  messageHost(){
    const cuurentUserId = this.authService.getUserId();   
    console.log('Host ID:', this.hostId);
    console.log('User ID:', cuurentUserId);
    console.log('Hostuser ID:', this.hostDetails.userId);
    this.ConvService.startConversation({
      user1Id: Number(cuurentUserId) , // Replace with actual user ID
      user2Id: this.hostDetails.userId, // Replace with actual user ID
      propertyId: this.propertyId, // Replace with actual property ID
      subject: `New Conversation with Host ${this.hostDetails.firstName} ${this.hostDetails.lastName}`
    }).subscribe({
      next: (response) => {
        console.log('Conversation started successfully:', response);
         this.router.navigate(['/messages']);
        // Handle successful conversation start
      },
      error: (error) => {
        console.error('Error starting conversation:', error);
        // Handle error
      }
    });
  }

}
