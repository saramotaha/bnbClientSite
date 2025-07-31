import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PropertyHostService } from './Service/property-host-service';
import { IHostProperty } from './ihost-property';

@Component({
  selector: 'app-property-host',
  imports: [],
templateUrl: './property-host.html',
  styleUrl: './property-host.css'
})
export class PropertyHost implements OnInit {
  constructor(private PropertyHostService : PropertyHostService,private cdr :ChangeDetectorRef){}
  hostDetails!:IHostProperty
  ngOnInit(): void {
    this.PropertyHostService.getHostById(this.hostDetails.id).subscribe({
       next: (PropertyHostDetailsRes) => {
          this.hostDetails = PropertyHostDetailsRes;
          console.log('Property details fetched successfully:', PropertyHostDetailsRes); 
          this.cdr.detectChanges();
        } ,
        error: (error) => { 
          console.error('Error fetching property details:', error);
        }
      });      
  }

}
