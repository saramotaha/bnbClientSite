import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { BookingResponseDto } from '../../models/booking.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reservations.html',
  styleUrls: ['./reservations.css']
})
export class Reservations implements OnInit {
  private bookingService = inject(BookingService);
  private router = inject(Router);

  activeTab = signal<string>('upcoming');
  reservations = signal<BookingResponseDto[]>([]);
  loading = signal<boolean>(false);

  // Dummy data for development
  private dummyReservations: BookingResponseDto[] = [
    {
      id: 1,
      propertyTitle: 'Modern Apartment in Downtown',
      propertyAddress: '123 Main St, New York, NY',
      startDate: '2025-08-15',
      endDate: '2025-08-18',
      guestName: 'John Smith',
      totalGuests: 2,
      status: 'confirmed',
      checkInStatus: 'pending',
      checkOutStatus: 'pending',
      totalAmount: 450,
      createdAt: '2025-07-20T10:00:00Z'
    },
    {
      id: 2,
      propertyTitle: 'Cozy Studio Near Central Park',
      propertyAddress: '456 Park Ave, New York, NY',
      startDate: '2025-09-01',
      endDate: '2025-09-05',
      guestName: 'Emma Johnson',
      totalGuests: 1,
      status: 'confirmed',
      checkInStatus: 'pending',
      checkOutStatus: 'pending',
      totalAmount: 320,
      createdAt: '2025-07-22T14:30:00Z'
    }
  ];

  filteredReservations = computed(() => {
    const today = new Date();
    const reservations = this.reservations();
    const activeTab = this.activeTab();
    
    switch (activeTab) {
      case 'upcoming':
        return reservations.filter(r => 
          new Date(r.startDate) >= today && r.status !== 'cancelled'
        );
      case 'completed':
        return reservations.filter(r => r.status === 'completed');
      case 'canceled':
        return reservations.filter(r => r.status === 'cancelled');
      case 'all':
      default:
        return reservations;
    }
  });

  ngOnInit() {
    this.loadReservations();
  }

  loadReservations() {
    this.loading.set(true);
    
    // Try to load from API, fallback to dummy data
    this.bookingService.getAll().subscribe({
      next: (data) => {
        this.reservations.set(data);
        this.loading.set(false);
      },
      error: (error) => {
        console.log('API not available, using dummy data');
        this.reservations.set(this.dummyReservations);
        this.loading.set(false);
      }
    });
  }

  setActiveTab(tab: string) {
    this.activeTab.set(tab);
  }

  goToHostDashboard() {
    this.router.navigate(['/host/today']);
  }

  seeAllReservations() {
    this.setActiveTab('all');
  }

  exportReservations() {
    // Export functionality
    console.log('Export reservations');
  }

  printReservations() {
    window.print();
  }

  openFilter() {
    // Filter functionality
    console.log('Open filter');
  }
}
