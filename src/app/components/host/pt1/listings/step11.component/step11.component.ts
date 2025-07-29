import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ListingService } from '../Listing.Service';

@Component({
  selector: 'app-step11',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './step11.component.html',
  styleUrls: ['./step11.component.css']
})
export class Step11Component {
  selectedOption: string = '';

  constructor(private router: Router, private listingService: ListingService) {
    this.selectedOption = this.listingService.listingData.guestType || '';
  }

  selectOption(option: string) {
    this.selectedOption = option;
    this.listingService.listingData.guestType = option;
  }

  goBack() {
    this.router.navigate(['/host/listings/create/step10']);
  }

  goNext() {
    if (this.selectedOption) {
      this.router.navigate(['/host/listings/create/step12']);
    }
  }
}
