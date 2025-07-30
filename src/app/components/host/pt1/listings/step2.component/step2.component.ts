import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ListingService } from '../Listing.Service';

@Component({
  selector: 'app-step2',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.css']
})
export class Step2Component {
  placeOptions = [
    {
      title: 'An entire place',
      description: 'Guests have the whole place to themselves.',
      icon: 'home'
    },
    {
      title: 'A room',
      description: 'Guests have their own room in a home, plus access to shared spaces.',
      icon: 'meeting_room'
    },
    {
      title: 'A shared room in a hostel',
      description: 'Guests sleep in a shared room in a professionally managed hostel with staff onsite 24/7.',
      icon: 'hotel'
    }
  ];

  selectedOption: any = null;

  constructor(
    private router: Router,
    private http: HttpClient,
    private listingService: ListingService
  ) {
    // استرجاع القيمة المحفوظة إذا كانت موجودة
    const savedPlaceType = this.listingService.listingData.placeType;
    if (savedPlaceType) {
      this.selectedOption = this.placeOptions.find(p => p.title === savedPlaceType) || null;
    }
  }

  selectOption(option: any) {
    this.selectedOption = option;
  }

  isLastOption(option: any): boolean {
    return this.placeOptions.indexOf(option) === this.placeOptions.length - 1;
  }

  back() {
    this.router.navigate(['/host/listings/create/step-1']);
  }

  next() {
    if (!this.selectedOption) return;

    this.listingService.listingData.placeType = this.selectedOption.title;

    const propertyId = this.listingService.getPropertyId();
    console.log('Using property ID:', propertyId);

    if (!propertyId) {
      console.error('No property ID found.');
      return;
    }

    const updateDto = {
      placeType: this.selectedOption.title
    };

    this.http.post<any>(`https://localhost:7145/api/Property/${propertyId}/place-type`, updateDto, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).subscribe({
      next: () => {
        this.router.navigate(['/host/listings/create/step3']);
      },
      error: (err) => {
        console.error('Failed to update property at step 2', err);
      }
    });
  }
}
