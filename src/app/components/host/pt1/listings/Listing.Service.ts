import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ListingService {
  private propertyId: number | null = null;

  constructor(private http: HttpClient) {
    const saved = localStorage.getItem('listingData');
    if (saved) {
      this.listingData = JSON.parse(saved);
    }

    const storedId = localStorage.getItem('propertyId');
    if (storedId) {
      this.propertyId = Number(storedId);
    }
  }

  listingData: {
    category?: string;
    placeType?: string;
    latitude?: number;
    longitude?: number;
    address?: string;
    maxGuests?: number;
    bedrooms?: number;
    bathrooms?: number;
    amenities?: { name: string; iconUrl: string }[];
    photos?: File[];
    imageUrls?: string[];
    title?: string;
    highlights?: string[];
    description?: string;
    bookingSetting?: string;
    guestType?: string;
    basePrice?: number;
    beds?: number;
    amenityIds?: number[];
    weekendPrice?: number;
    hasCamera?: boolean;
    hasNoiseMonitor?: boolean;
    hasWeapons?: boolean;
    country?: string;
    apt?: string;
    street?: string;
    city?: string;
    governorate?: string;
    postalCode?: string;
  } = {};

  saveDataToLocalStorage() {
    localStorage.setItem('listingData', JSON.stringify(this.listingData));
  }

  setPropertyId(id: number) {
    this.propertyId = id;
    localStorage.setItem('propertyId', id.toString());
  }

  getPropertyId(): number | null {
    return this.propertyId;
  }

  setDescription(id: number, description: string) {
    return this.http.post(`https://localhost:7145/api/property/${id}/description`, { description });
  }

  setBookingSetting(id: number, bookingSetting: string) {
    return this.http.post(`https://localhost:7145/api/property/${id}/booking-setting`, { bookingSetting });
  }

  savePricing(basePrice: number, weekendPrice: number) {
    const id = this.getPropertyId();
    if (!id) throw new Error('Property ID not found');
    
    return this.http.post(`https://localhost:7145/api/property/${id}/pricing`, {
      basePrice,
      weekendPrice
    });
  }

  setAddress(propertyId: number, dto: any) {
    return this.http.post(`https://localhost:7145/api/property/${propertyId}/address`, dto);
  }



  
  setSafetyDetails() {
    const id = this.getPropertyId();
    if (!id) throw new Error('Property ID not found');

    const { hasCamera, hasNoiseMonitor, hasWeapons } = this.listingData;

    return this.http.post(`https://localhost:7145/api/property/${id}/safety-details`, {
      hasSecurityCamera: hasCamera,
      hasNoiseMonitor: hasNoiseMonitor,
      hasWeapons: hasWeapons
    });
  }
  resetListingData() {
  this.listingData = {};
  this.propertyId = null;
  localStorage.removeItem('listingData');
  localStorage.removeItem('propertyId');
}

}
