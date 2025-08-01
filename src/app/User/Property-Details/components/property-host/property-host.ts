import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { PropertyHostService } from './Service/property-host-service';
import { IHostProperty } from './ihost-property';
import { ConversationService } from '../../../messages/sidebar/conversation.service';
import { messageService } from '../../../messages/chat/message.service';

@Component({
  selector: 'app-property-host',
  imports: [],
templateUrl: './property-host.html',
  styleUrl: './property-host.css'
})
export class PropertyHost implements OnInit {
  constructor(private PropertyHostService : PropertyHostService,private cdr :ChangeDetectorRef , private ConvService:ConversationService , MsgService :messageService ){}
  hostDetails!:IHostProperty
  @Input() hostId!: number;
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

  }

}
