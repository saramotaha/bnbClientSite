import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ListingService } from '../Listing.Service';

@Component({
  selector: 'app-step16',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './step16.component.html',
  styleUrls: ['./step16.component.css']
})
export class Step16Component implements OnInit {
  country: string = 'Egypt';
  apt: string = '';
  street: string = '';
  city: string = '';
  governorate: string = '';
  postalCode: string = '';

  countries: string[] = ['Egypt', 'United States', 'United Kingdom', 'Germany', 'France', 'Italy', 'Spain', 'India'];

  constructor(
    private router: Router,
    private listingService: ListingService
  ) {}

  ngOnInit(): void {
    const saved = this.listingService.listingData;
    this.country = saved.country || 'Egypt';
    this.apt = saved.apt || '';
    this.street = saved.street || '';
    this.city = saved.city || '';
    this.governorate = saved.governorate || '';
    this.postalCode = saved.postalCode || '';
  }

  get isFormValid(): boolean {
    return !!(this.country && this.apt && this.street && this.city && this.governorate && this.postalCode);
  }

  goBack() {
    this.saveData();
    this.router.navigate(['/host/listings/create/step15']);
  }

  createListing() {
  if (!this.isFormValid) return;

  this.saveData();

  const id = this.listingService.getPropertyId();
  if (!id) {
    console.error('Property ID not found');
    return;
  }

  const addressDto = {
    country: this.country,
    address: `${this.street}, Apt: ${this.apt}`,
    city: this.city,
    postalCode: this.postalCode
  };

  this.listingService.setAddress(id, addressDto).subscribe({
    next: () => {
      this.router.navigate(['/host/listings']);
    },
    error: (err) => {
      console.error('Failed to save address', err);
      alert('Failed to save address. Please try again later.');
    }
  });
}



  private saveData() {
    this.listingService.listingData.country = this.country;
    this.listingService.listingData.apt = this.apt;
    this.listingService.listingData.street = this.street;
    this.listingService.listingData.city = this.city;
    this.listingService.listingData.governorate = this.governorate;
    this.listingService.listingData.postalCode = this.postalCode;
    this.listingService.saveDataToLocalStorage();
  }
}
