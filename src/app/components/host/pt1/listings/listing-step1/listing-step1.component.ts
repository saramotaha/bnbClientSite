import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ListingService } from '../Listing.Service';
import { AuthService } from '../../../../../Pages/Auth/auth.service'; // Adjusted import path

@Component({
  selector: 'app-listing-step1',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listing-step1.component.html',
  styleUrls: ['./listing-step1.component.css']
})
export class ListingStep1Component {
  categories = [
    { label: 'House', icon: '🏠' },
    { label: 'Apartment', icon: '🏢' },
    { label: 'Barn', icon: '🏚️' },
    { label: 'Bed & breakfast', icon: '🛏️' },
    { label: 'Boat', icon: '⛵' },
    { label: 'Cabin', icon: '🏡' },
    { label: 'Camper/RV', icon: '🚐' },
    { label: 'Casa particular', icon: '🏘️' },
    { label: 'Castle', icon: '🏰' },
    { label: 'Cave', icon: '🕳️' },
    { label: 'Container', icon: '📦' },
    { label: 'Cycladic home', icon: '🏝️' }
  ];

  selectedCategory: string | null = null;

  constructor(
    private router: Router,
    private http: HttpClient,
    private route: ActivatedRoute,
    private listingService: ListingService,
    private authService: AuthService // Injected AuthService
  ) {
    const isNew = this.route.snapshot.queryParamMap.get('new');
    if (isNew === 'true') {
      this.listingService.resetListingData();
    }

    this.selectedCategory = this.listingService.listingData.category || "home";

    this.route.queryParams.subscribe(params => {
      if (params['type']) {
        this.selectedCategory = params['type'];
      }
    });
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
  }

  goBack() {
    this.router.navigate(['/host/dashboard/listings']);
  }

  goNext() {
    if (!this.selectedCategory) return;

    this.listingService.listingData.category = this.selectedCategory;

    const hostId = this.authService.getHostId(); // Get hostId from AuthService
    if (!hostId) {
      console.error('No hostId available');
      return;
    }

    const createDto = {
      hostId: hostId, // Use the hostId from AuthService
      title: '',
      description: '',
      propertyType: 'home',
      country: '',
      address: '',
      city: '',
      postalCode: '',
      latitude: 0,
      longitude: 0,
      pricePerNight: 0,
      cleaningFee: 0,
      serviceFee: 0,
      minNights: 1,
      maxNights: 1,
      bedrooms: 1,
      bathrooms: 1,
      maxGuests: 1,
      checkInTime: null,
      checkOutTime: null,
      instantBook: false,
      cancellationPolicyId: null,
      categoryId: null
    };

        this.http.post<any>('http://localhost:7145/api/Property', createDto, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).subscribe({
      next: (res) => {
        const id = res.id;
        this.listingService.setPropertyId(id);
        this.router.navigate(['/host/listings/create/step-2'], {
          queryParams: { type: this.selectedCategory }
        });
      },
      error: (err) => {
        console.error('Failed to create property', err);
      }
    });
  }
}