import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ListingService } from '../Listing.Service';

@Component({
  selector: 'app-step13',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './step13.component.html',
  styleUrls: ['./step13.component.css']
})
export class Step13Component implements OnInit {
  basePrice: number = 30;
  premiumPercentage: number = 0;
  guestPrice: number = 34;
  weekendPrice: number = 30;

  constructor(private router: Router, private listingService: ListingService) {}

  ngOnInit() {
    const data = this.listingService.listingData;

    if (data.basePrice !== undefined) this.basePrice = data.basePrice;
    if (data.weekendPrice !== undefined) {
      this.weekendPrice = data.weekendPrice;
      this.premiumPercentage = Math.round(((this.weekendPrice - this.basePrice) / this.basePrice) * 100);
    }

    this.updatePrices();
  }

  updatePrices() {
    this.weekendPrice = this.basePrice + (this.basePrice * this.premiumPercentage / 100);
    this.guestPrice = this.weekendPrice + (this.weekendPrice * 0.15);
  }

  goBack() {
    this.saveCurrentStep(); // نحفظ قبل الرجوع
    this.router.navigate(['/host/listings/create/step12']);
  }

  goNext() {
    this.saveCurrentStep(); // نحفظ قبل التقدم
    this.router.navigate(['/host/listings/create/step14']);
  }

  private saveCurrentStep() {
    this.listingService.listingData.basePrice = this.basePrice;
    this.listingService.listingData.weekendPrice = this.weekendPrice;
  }
}
