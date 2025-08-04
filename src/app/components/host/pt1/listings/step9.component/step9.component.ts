import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ListingService } from '../Listing.Service';

@Component({
  selector: 'app-step9',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './step9.component.html',
  styleUrls: ['./step9.component.css']
})
export class Step9Component implements OnInit {
  description: string = '';

  constructor(private router: Router, private listingService: ListingService) {}

  ngOnInit() {
    if (this.listingService.listingData.description) {
      this.description = this.listingService.listingData.description;
    }
  }

  goNext() {
    const id = this.listingService.getPropertyId();
    if (!id) {
      console.error('Property ID not found in localStorage!');
      return;
    }

    const desc = this.description.trim();
    if (!desc) return;

    this.listingService.setDescription(id, desc).subscribe({
      next: () => {
        this.listingService.listingData.description = desc;
        this.listingService.saveDataToLocalStorage(); // ✅ حفظ في localStorage
        this.router.navigate(['/host/listings/create/step12']);
      },
      error: (err) => {
        console.error('Error saving description:', err);
      }
    });
  }

  goBack() {
    this.listingService.listingData.description = this.description.trim();
    this.listingService.saveDataToLocalStorage();

    this.router.navigate(['/host/listings/create/step8']);
  }
}
