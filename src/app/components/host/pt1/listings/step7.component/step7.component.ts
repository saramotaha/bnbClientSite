import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ListingService } from '../Listing.Service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-step7',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './step7.component.html',
  styleUrls: ['./step7.component.css']
})
export class Step7Component implements OnInit {
  title: string = '';

  constructor(
    private router: Router,
    private listingService: ListingService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    // ✅ استرجاع العنوان لو كان محفوظ
    const savedTitle = this.listingService.listingData.title;
    if (savedTitle) {
      this.title = savedTitle;
    }
  }

  goNext() {
    if (this.title.trim()) {
      const trimmedTitle = this.title.trim();
      this.listingService.listingData.title = trimmedTitle;

      const propertyId = this.listingService.getPropertyId();
      if (propertyId === null) {
        console.error('Property ID not found!');
        return;
      }

      this.http.post(`https://localhost:7145/api/property/${propertyId}/title`, {
        title: trimmedTitle
      }).subscribe({
        next: () => {
          this.router.navigate(['/host/listings/create/step8']);
        },
        error: (err) => {
          console.error('Error saving title:', err);
        }
      });
    }
  }

  goBack() {
    this.listingService.listingData.title = this.title.trim(); // ✅ احفظ العنوان قبل ما ترجع
    this.router.navigate(['/host/listings/create/step6']);
  }
}
