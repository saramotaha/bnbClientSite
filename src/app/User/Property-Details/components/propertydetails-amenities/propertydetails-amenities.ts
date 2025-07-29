import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IAmenity, IpropertyAmenity } from './iproperty-amenity';
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
  visibleAmenities: any[] = [];
  groupedAmenities: { [category: string]: IAmenity[] } = {};

  ngOnInit(): void {
    this.propertyDetailsAmentyService.getAmenitiesForProperty(this.propertyId).subscribe({
      next: (amenitiesResponse) => {
        this.propertyDetailsAmenities = amenitiesResponse;
            this.visibleAmenities = this.propertyDetailsAmenities.slice(0, 10);
        // Group by category
            this.groupedAmenities = this.groupAmenitiesByCategory(this.propertyDetailsAmenities);
        console.log('Amenities fetched successfully:', amenitiesResponse);
        this.cdr.detectChanges(); 
      },
      error: (error) => {
        console.error('Error fetching amenities:', error);
      }
    });
  }

  
private groupAmenitiesByCategory(data: IpropertyAmenity[]): { [category: string]: IAmenity[] } {
  const grouped: { [category: string]: IAmenity[] } = {};
  for (const item of data) {
    const category = item.amenity.category;
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(item.amenity);
  }
  return grouped;
}
get amenityCategories(): string[] {
  return Object.keys(this.groupedAmenities);
}
get totalAmenitiesCount(): number {
  return this.propertyDetailsAmenities.length;
}
}
