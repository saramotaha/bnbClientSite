import { CommonModule } from '@angular/common';
import { Component, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import { NgZone, ChangeDetectorRef } from '@angular/core';
import { ListingService } from '../Listing.Service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-step3',
  templateUrl: './step3.component.html',
  styleUrls: ['./step3.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class Step3Component implements AfterViewInit {
  address: string = '';
  selectedAddress: string = 'Drag the map to reposition the pin';
  map!: L.Map;
  marker!: L.Marker;

  constructor(
    private router: Router,
    private http: HttpClient,
    private listingService: ListingService,
    private zone: NgZone,
    private cdr: ChangeDetectorRef // ✅ Added to fix ExpressionChanged error
  ) {}

 ngAfterViewInit(): void {
  setTimeout(() => {
    const savedLat = this.listingService.listingData.latitude;
    const savedLng = this.listingService.listingData.longitude;
    const savedAddress = this.listingService.listingData.address;

    if (savedLat && savedLng) {
      this.address = savedAddress || '';
      this.selectedAddress = savedAddress || 'Saved location';
      this.initMap(savedLat, savedLng);
    } else {
      navigator.geolocation.getCurrentPosition(
        position => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          this.initMap(lat, lng);
        },
        () => {
          this.initMap(30.0444, 31.2357); // fallback
        }
      );
    }
  });
}


  initMap(lat: number, lng: number) {
    this.map = L.map('map').setView([lat, lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    const icon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });

    this.marker = L.marker([lat, lng], { icon }).addTo(this.map);

    this.map.on('move', () => {
      const center = this.map.getCenter();
      this.marker.setLatLng(center);
    });

    this.map.on('moveend', () => {
      const center = this.map.getCenter();
      this.fetchAddress(center.lat, center.lng);
    });

    this.fetchAddress(lat, lng);
  }

  fetchAddress(lat: number, lng: number) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
  fetch(url)
    .then(res => res.json())
    .then(data => {
      this.zone.run(() => {
        this.selectedAddress = data.display_name || 'Unknown location';
        this.address = this.selectedAddress;
      });
    })
    .catch(() => {
      this.zone.run(() => {
        this.selectedAddress = 'Unable to fetch address';
      });
    });
}


  onAddressChange() {
    if (!this.address) return;

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(this.address)}`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          this.map.setView([lat, lon], 13);
          this.marker.setLatLng([lat, lon]);
          this.fetchAddress(lat, lon);
        }
      });
  }

  goToNextStep() {
    const center = this.map.getCenter();
    const lat = center.lat;
    const lng = center.lng;

    this.listingService.listingData.latitude = lat;
    this.listingService.listingData.longitude = lng;
    this.listingService.listingData.address = this.address;

    const propertyId = this.listingService.getPropertyId();
    if (!propertyId) {
      console.error('No property ID found.');
      return;
    }

    const updateDto = {
      latitude: lat,
      longitude: lng,
      address: this.address
    };

    this.http.post<any>(
      `https://localhost:7145/api/Property/${propertyId}/location`,
      updateDto,
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      }
    ).subscribe({
      next: () => {
        this.router.navigate(['/host/listings/create/step4']);
      },
      error: (err) => {
        console.error('Failed to update property location', err);
      }
    });
  }

  goToPreviousStep() {
    this.router.navigate(['/host/listings/create/step-2']);
  }
}
