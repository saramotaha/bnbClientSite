import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ImageGallery } from "../components/image-gallery/image-gallery";
import { BaseNav } from "../../../Shared/base-nav/base-nav/base-nav";
import { Footer } from "../../../Shared/footer/footer";
import { BehaviorSubject } from 'rxjs';
import { IPropertyList } from '../../../Core/Models/iproperty-list';
import { PropertyDetailsService } from './property-details-service';
import { PropertyDetialsReview } from "../components/property-detials-review/property-detials-review";
import { HostInfo } from "../../../components/host-info/host-info";
import { Hostinfo } from "../components/hostinfo/hostinfo";
import { Propertybookingcard } from "../components/propertybookingcard/propertybookingcard";
import { PropertydetailsAmenities } from "../components/propertydetails-amenities/propertydetails-amenities";
import { PropertydetailsCalendar } from "../components/propertydetails-calendar/propertydetails-calendar";

@Component({
  selector: 'app-property-details',
  imports: [ImageGallery, BaseNav, Footer, PropertyDetialsReview, HostInfo, Hostinfo, Propertybookingcard, PropertydetailsAmenities, PropertydetailsCalendar],
templateUrl: './property-details.html',
  styleUrl: './property-details.css'
})
export class PropertyDetails implements OnInit {
  constructor(private PropertyDetailsService:PropertyDetailsService, private cdr: ChangeDetectorRef) {}
  propertyId= 1;
  propertyDetails !: IPropertyList;
  
  ngOnInit(): void {
    this.PropertyDetailsService.getPropertyDetailsById(this.propertyId).subscribe({
      next: (propertyDetailsRes) => {
        this.propertyDetails = propertyDetailsRes;
        console.log('Property details fetched successfully:', propertyDetailsRes);
                console.log('Property detailsDes successfully:', propertyDetailsRes.description);
        this.cdr.detectChanges();
      } ,
      error: (error) => { 
        console.error('Error fetching property details:', error);
      }
    });      
    
  }
  

}
