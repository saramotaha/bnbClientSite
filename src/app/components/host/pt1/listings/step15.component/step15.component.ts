import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ListingService } from '../Listing.Service';

@Component({
  selector: 'app-step15',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './step15.component.html',
  styleUrls: ['./step15.component.css'],
})
export class Step15Component {
  hasCamera = false;
  hasNoiseMonitor = false;
  hasWeapons = false;

  constructor(private router: Router, private listingService: ListingService) {
    // استرجاع القيم من الخدمة
    const data = this.listingService.listingData;
    this.hasCamera = data.hasCamera ?? false;
    this.hasNoiseMonitor = data.hasNoiseMonitor ?? false;
    this.hasWeapons = data.hasWeapons ?? false;
  }

  goBack() {
    this.saveToService();
    this.router.navigate(['/host/listings/create/step14']);
  }

  goNext() {
  this.saveToService();

  this.listingService.setSafetyDetails().subscribe({
    next: () => {
      this.router.navigate(['/host/listings/create/step16']);
    },
    error: (err) => {
      console.error('Failed to save safety details', err);
      alert('Failed to save safety details. Please try again later.');
    }
  });
}


  private saveToService() {
    this.listingService.listingData.hasCamera = this.hasCamera;
    this.listingService.listingData.hasNoiseMonitor = this.hasNoiseMonitor;
    this.listingService.listingData.hasWeapons = this.hasWeapons;
    this.listingService.saveDataToLocalStorage(); 
  }
}
