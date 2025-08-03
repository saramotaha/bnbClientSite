import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ListingService } from '../Listing.Service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-step4',
  templateUrl: './step4.component.html',
  styleUrls: ['./step4.component.css']
})
export class Step4Component implements OnInit {
  guests = 2;
  bedrooms = 1;
  beds = 1;
  bathrooms = 1;

  constructor(
    private router: Router,
    private http: HttpClient,
    private listingService: ListingService
  ) {}

  ngOnInit(): void {
    const data = this.listingService.listingData;
    if (data.maxGuests) this.guests = data.maxGuests;
    if (data.bedrooms) this.bedrooms = data.bedrooms;
    if (data.bathrooms) this.bathrooms = data.bathrooms;

    if (data.beds) this.beds = data.beds;
  }

  increment(field: 'guests' | 'bedrooms' | 'beds' | 'bathrooms') {
    this[field]++;
  }

  decrement(field: 'guests' | 'bedrooms' | 'beds' | 'bathrooms') {
    if (this[field] > 1) this[field]--;
  }

  goNext() {
    const propertyId = this.listingService.getPropertyId();
    if (!propertyId) {
      console.error('No property ID found.');
      return;
    }

    this.listingService.listingData.maxGuests = this.guests;
    this.listingService.listingData.bedrooms = this.bedrooms;
    this.listingService.listingData.bathrooms = this.bathrooms;
    this.listingService.listingData.beds = this.beds;

    const updateDto = {
      maxGuests: this.guests,
      bedrooms: this.bedrooms,
      bathrooms: this.bathrooms
    };

    this.http.post(`http://localhost:7145/api/Property/${propertyId}/step4`, updateDto, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).subscribe({
      next: () => this.router.navigate(['/host/listings/create/step5']),
      error: (err) => console.error('Error updating step 4 data:', err)
    });
  }

  goBack() {
    this.router.navigate(['/host/listings/create/step3']);
  }
}
