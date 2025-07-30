import {
  Component,
  OnInit,
  inject,
  signal,
  computed
} from '@angular/core';
import { Router } from '@angular/router';
 import { BookingService } from '../../services/booking.service';
import { AuthService } from '../../../../../Pages/Auth/auth.service';
import { BookingResponseDto } from '../../models/booking.model';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reservations.html',
  styleUrls: ['./reservations.css']
})
 export class Reservations implements OnInit {
   private bookingService = inject(BookingService);
   private authService = inject(AuthService);
   private cdRef = inject(ChangeDetectorRef);
   private router = inject(Router);

   activeTab = signal<string>('upcoming');
   reservations = signal<BookingResponseDto[]>([]);
   loading = signal<boolean>(false);
   
   filteredReservations = computed(() => {
  const today = new Date();
  const all = this.reservations();
  const tab = this.activeTab();

  // Helper function to safely parse dates
  const parseDate = (dateInput: string | Date): Date => {
    // If already a Date object, return it directly
    if (dateInput instanceof Date) return dateInput;
    
    // If string, try parsing (handle both ISO and other formats)
    const parsed = new Date(dateInput);
    return isNaN(parsed.getTime()) ? new Date() : parsed; // Fallback to today if invalid
  };

  return all.filter(r => {
    const startDate = parseDate(r.startDate);
    
    switch (tab) {
      case 'upcoming':
        return startDate >= today && r.status !== 'cancelled';
      case 'completed':
        return r.status === 'completed';
      case 'cancelled':
        return r.status === 'cancelled';
      case 'all':
      default:
        return true;
    }
  });
});

   ngOnInit(): void {
     this.loadReservations();
   }

loadReservations(): void {
  this.loading.set(true);

  const hostId = Number(this.authService.getHostId());
  if (!hostId) {
    console.warn('Missing host ID.');
    this.loading.set(false);
    this.cdRef.detectChanges(); // Manually trigger change detection
    return;
  }

  this.bookingService.getBookingsByHost(hostId).subscribe({
    next: (bookings) => {
      this.reservations.set(bookings);
      this.loading.set(false);
      this.cdRef.detectChanges(); // Ensure UI reflects the new state
    },
    error: (err) => {
      console.error('Failed to load reservations:', err);
      this.reservations.set([]);
      this.loading.set(false);
      this.cdRef.detectChanges(); // Reflect error state in the view
    }
  });
}


   setActiveTab(tab: string): void {
     this.activeTab.set(tab);
   }

   goToHostDashboard(): void {
     this.router.navigate(['/host/today']);
   }

   seeAllReservations(): void {
     this.setActiveTab('all');
   }

   printReservations(): void {
     window.print();
   }

   openFilter(): void {
     console.log('Filter modal or drawer goes here 🎛️');
   }
}
