import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ListingService } from '../Listing.Service'; 

@Component({
  selector: 'app-step8',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './step8.component.html',
  styleUrls: ['./step8.component.css']
})
export class Step8Component {
  highlights = [
    { label: 'Peaceful', icon: 'bi-tree' },
    { label: 'Unique', icon: 'bi-lightbulb' },
    { label: 'Family-friendly', icon: 'bi-people' },
    { label: 'Stylish', icon: 'bi-brush' },
    { label: 'Central', icon: 'bi-geo-alt' },
    { label: 'Spacious', icon: 'bi-arrows-fullscreen' }
  ];

  selected: string[] = [];

  constructor(private router: Router, private listingService: ListingService) {
    this.selected = this.listingService.listingData.highlights || [];
  }

  toggleHighlight(highlight: string) {
    if (this.selected.includes(highlight)) {
      this.selected = this.selected.filter(h => h !== highlight);
    } else {
      this.selected.push(highlight);
    }
  }

  isSelected(highlight: string): boolean {
    return this.selected.includes(highlight);
  }

  goNext() {
    if (this.selected.length > 0) {
      this.listingService.listingData.highlights = this.selected;
      this.router.navigate(['/host/listings/create/step9']);
    }
  }

  goBack() {
    this.router.navigate(['/host/listings/create/step7']);
  }
}
