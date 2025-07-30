import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ImageGallery } from "../components/image-gallery/image-gallery";
import { BaseNav } from "../../../Shared/base-nav/base-nav/base-nav";
import { Footer } from "../../../Shared/footer/footer";
import { BehaviorSubject } from 'rxjs';
import { IPropertyList } from '../../../Core/Models/iproperty-list';
import { PropertyDetailsService } from './property-details-service';
import { PropertyDetialsReview } from "../components/property-detials-review/property-detials-review";
import { Hostinfo } from "../components/hostinfo/hostinfo";
import { Propertybookingcard } from "../components/propertybookingcard/propertybookingcard";
import { PropertydetailsAmenities } from "../components/propertydetails-amenities/propertydetails-amenities";
import { PropertydetailsCalendar } from "../components/propertydetails-calendar/propertydetails-calendar";
import { Route, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-property-details',
  imports: [ImageGallery, BaseNav, Footer, PropertyDetialsReview, Hostinfo, Hostinfo, Propertybookingcard, PropertydetailsAmenities, PropertydetailsCalendar],
templateUrl: './property-details.html',
  styleUrl: './property-details.css'
})
export class PropertyDetails implements OnInit {
  constructor(private PropertyDetailsService:PropertyDetailsService, private cdr: ChangeDetectorRef,private route:ActivatedRoute) {}
  propertyId!:number;
  propertyDetails !: IPropertyList;
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.propertyId = +params['id']; // Get the property ID from the route parameters
      console.log('Property ID from route:', this.propertyId);
    });
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
