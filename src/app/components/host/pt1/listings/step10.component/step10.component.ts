import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ListingService } from '../Listing.Service';

@Component({
  selector: 'app-step10',
  templateUrl: './step10.component.html',
  styleUrls: ['./step10.component.css']
})
export class Step10Component implements OnInit {
  selectedOption: string | null = null;

  constructor(private router: Router, private listingService: ListingService) {}

  ngOnInit() {
    // ✅ تحميل القيمة المختارة من السيرفيس أو من localStorage
    this.selectedOption = this.listingService.listingData.bookingSetting || null;
  }

  selectOption(option: string) {
    this.selectedOption = option;
    this.listingService.listingData.bookingSetting = option;
    this.listingService.saveDataToLocalStorage(); // ✅ حفظ الاختيار في localStorage
  }

  goNext() {
    const id = this.listingService.getPropertyId();
    if (!id || !this.selectedOption) return;

    this.listingService.setBookingSetting(id, this.selectedOption).subscribe({
      next: () => {
        this.listingService.saveDataToLocalStorage(); // ✅ تأكيد حفظ بعد الحفظ في السيرفر
        this.router.navigate(['/host/listings/create/step11']);
      },
      error: (err) => {
        console.error('Error saving booking setting:', err);
      }
    });
  }

  goBack() {
    // ✅ نحفظ قبل الرجوع برضو
    if (this.selectedOption) {
      this.listingService.listingData.bookingSetting = this.selectedOption;
      this.listingService.saveDataToLocalStorage();
    }

    this.router.navigate(['/host/listings/create/step9']);
  }
}
