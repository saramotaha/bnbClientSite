import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ListingService } from '../Listing.Service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

interface Amenity {
  name: string;
  label: string;
  icon: string;
  selected: boolean;
}

@Component({
  selector: 'app-step5',
  templateUrl: './step5.component.html',
  styleUrls: ['./step5.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule]
})
export class Step5Component implements OnInit {
  constructor(
    private router: Router,
    private http: HttpClient,
    private listingService: ListingService
  ) {}

  guestFavorites: Amenity[] = [
    { name: 'wifi', label: 'Wi-Fi', icon: 'fas fa-wifi', selected: false },
    { name: 'tv', label: 'TV', icon: 'fas fa-tv', selected: false },
    { name: 'kitchen', label: 'Kitchen', icon: 'fas fa-utensils', selected: false }
  ];

  standoutAmenities: Amenity[] = [
    { name: 'pool', label: 'Pool', icon: 'fas fa-swimming-pool', selected: false },
    { name: 'hot_tub', label: 'Hot Tub', icon: 'fas fa-hot-tub', selected: false },
    { name: 'gym', label: 'Gym', icon: 'fas fa-dumbbell', selected: false }
  ];

  safetyItems: Amenity[] = [
    { name: 'fire_extinguisher', label: 'Fire Extinguisher', icon: 'fas fa-fire-extinguisher', selected: false },
    { name: 'first_aid_kit', label: 'First Aid Kit', icon: 'fas fa-briefcase-medical', selected: false },
    { name: 'smoke_alarm', label: 'Smoke Alarm', icon: 'fas fa-bell', selected: false }
  ];

  private amenityNameToIdMap: { [key: string]: number } = {
    wifi: 1,
    tv: 2,
    kitchen: 3,
    pool: 4,
    hot_tub: 5,
    gym: 6,
    fire_extinguisher: 7,
    first_aid_kit: 8,
    smoke_alarm: 9
  };

  private amenityIdToNameMap: { [key: number]: string } = Object.entries(this.amenityNameToIdMap)
    .reduce((acc, [name, id]) => {
      acc[id] = name;
      return acc;
    }, {} as { [key: number]: string });

  ngOnInit() {
    const savedIds = this.listingService.listingData.amenityIds || [];

    const allAmenities = [
      ...this.guestFavorites,
      ...this.standoutAmenities,
      ...this.safetyItems
    ];

    const selectedNames = savedIds.map(id => this.amenityIdToNameMap[id]);

    allAmenities.forEach(amenity => {
      if (selectedNames.includes(amenity.name)) {
        amenity.selected = true;
      }
    });
  }

  toggleSelection(amenity: Amenity) {
    amenity.selected = !amenity.selected;
  }

  goBack() {
    this.router.navigate(['/host/listings/create/step4']);
  }

  goNext() {
    const propertyId = this.listingService.getPropertyId();
    if (!propertyId) {
      console.error('No property ID found.');
      return;
    }

    const selectedAmenities = [
      ...this.guestFavorites,
      ...this.standoutAmenities,
      ...this.safetyItems
    ].filter(a => a.selected);

    const selectedIds = selectedAmenities
      .map(a => this.amenityNameToIdMap[a.name])
      .filter(id => id);

    this.listingService.listingData.amenityIds = selectedIds;

    const updateDto = {
      amenityIds: selectedIds
    };

    this.http.post(`http://localhost:7145/api/Property/update-step5/${propertyId}`, updateDto, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).subscribe({
      next: () => {
        this.router.navigate(['/host/listings/create/step6']);
      },
      error: (err) => {
        console.error('Error updating amenities:', err);
      }
    });
  }
}
