import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IpropertyAmenity } from './iproperty-amenity';
import { PropertydetailsAmenityService } from './Service/propertydetails-amenity-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-propertydetails-amenities',
  imports: [CommonModule],
  templateUrl: './propertydetails-amenities.html',
  styleUrl: './propertydetails-amenities.css'
})
export class PropertydetailsAmenities implements OnInit {
constructor(private propertyDetailsAmentyService:PropertydetailsAmenityService ,private cdr :ChangeDetectorRef) {}
  propertyId = 1; // This should be dynamically set based on the property being viewed
  propertyDetailsAmenities: IpropertyAmenity[] = [];

  ngOnInit(): void {
    this.propertyDetailsAmentyService.getAmenitiesForProperty(this.propertyId).subscribe({
      next: (amenitiesResponse) => {
        this.propertyDetailsAmenities = amenitiesResponse;
        console.log('Amenities fetched successfully:', amenitiesResponse);
        this.cdr.detectChanges(); 
      },
      error: (error) => {
        console.error('Error fetching amenities:', error);
      }
    });
  }
}
