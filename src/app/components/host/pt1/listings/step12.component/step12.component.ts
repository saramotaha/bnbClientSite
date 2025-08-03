import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ListingService } from '../Listing.Service';

@Component({
  selector: 'app-step12',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './step12.component.html',
  styleUrls: ['./step12.component.css'],
})
export class Step12Component {
  basePrice: number = 0;
  serviceFee: number = 0;
  guestPrice: number = 0;
  youEarn: number = 0;
  showDetails: boolean = false;

  constructor(private router: Router, private listingService: ListingService) {}

  ngOnInit() {
    // ✅ تحميل السعر المحفوظ عند فتح الصفحة
    if (this.listingService.listingData.basePrice) {
      this.basePrice = this.listingService.listingData.basePrice;
      this.updatePrices();
    }
  }

  get isValidPrice(): boolean {
    return this.basePrice >= 10 && this.basePrice <= 10000;
  }

  onEditableInput(event: Event) {
    const input = (event.target as HTMLElement).innerText.trim();
    const value = Number(input);

    this.basePrice = isNaN(value) ? 0 : value;
    this.updatePrices();
  }

  updatePrices() {
    if (this.isValidPrice) {
      this.serviceFee = Math.round(this.basePrice * 0.125);
      this.guestPrice = this.basePrice + this.serviceFee;
      this.youEarn = this.basePrice - 1;

      // ✅ حفظ السعر محليًا في ListingService
      this.listingService.listingData.basePrice = this.basePrice;
    } else {
      this.serviceFee = 0;
      this.guestPrice = 0;
      this.youEarn = 0;
      this.listingService.listingData.basePrice = undefined;
    }
  }

  toggleDetails() {
    this.showDetails = !this.showDetails;
  }

  goBack() {
    this.router.navigate(['/host/listings/create/step9']);
  }

  goNext() {
    const weekendPrice = this.listingService.listingData.weekendPrice || this.basePrice;
    if (this.isValidPrice) {
      this.listingService.savePricing(this.basePrice, weekendPrice).subscribe({
        next: () => this.router.navigate(['/host/listings/create/step15']),
        error: (err) => console.error('Failed to save pricing:', err),
      });
    }
  }
}
