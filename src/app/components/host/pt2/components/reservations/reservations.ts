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
import { BookingResponseDto, BookingStatusUpdateDto } from '../../models/booking.model';
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
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  activeTab = signal<string>('pending');
  reservations = signal<BookingResponseDto[]>([]);
  loading = signal<boolean>(false);

  filteredReservations = computed(() => {
    const allReservations = this.reservations();
    const currentTab = this.activeTab();

    return allReservations.filter(reservation => {
      const status = reservation.status.toLowerCase();
      const startDate = new Date(reservation.startDate);
      const endDate = new Date(reservation.endDate);
      const today = new Date();
      const isPast = endDate < today;

      switch (currentTab) {
        case 'pending':
          // Show ALL pending reservations regardless of date
          return status === 'pending';

        case 'confirmed':
          // Show only confirmed reservations that aren't past
          return status === 'confirmed' && !isPast;

        case 'completed':
          // Show completed or past confirmed stays
          return status === 'completed' || 
                (status === 'confirmed' && isPast);

        case 'cancelled':
          return status === 'cancelled';

        case 'all':
          return true;

        default:
          return false;
      }
    });
  });

  // Rest of the component remains exactly the same
  confirmReservation(id: number): void {
    const dto: BookingStatusUpdateDto = { status: 'confirmed' };
    this.updateReservationStatus(id, dto);
  }

  cancelReservation(id: number): void {
    const dto: BookingStatusUpdateDto = { status: 'cancelled' };
    this.updateReservationStatus(id, dto);
  }

  private updateReservationStatus(id: number, dto: BookingStatusUpdateDto): void {
    this.loading.set(true);
    this.bookingService.updateBookingStatus(id, dto).subscribe({
      next: () => {
        const updatedReservations = this.reservations().map(res => {
          if (res.id === id) {
            return { 
              ...res, 
              status: dto.status,
              ...(dto.status === 'confirmed' && { checkInStatus: 'pending' })
            };
          }
          return res;
        });
        
        this.reservations.set(updatedReservations);
        this.loading.set(false);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to update reservation status:', err);
        this.loading.set(false);
        this.cdr.detectChanges();
      }
    });
  }

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.loading.set(true);
    const hostId = Number(this.authService.getHostId());
    
    if (!hostId) {
      console.warn('Missing host ID.');
      this.loading.set(false);
      this.cdr.detectChanges();
      return;
    }

    this.bookingService.getBookingsByHost(hostId).subscribe({
      next: (bookings) => {
        this.reservations.set(bookings);
        this.loading.set(false);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load reservations:', err);
        this.reservations.set([]);
        this.loading.set(false);
        this.cdr.detectChanges();
      }
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab.set(tab);
  }

  goToHostDashboard(): void {
    this.router.navigate(['/host/dashboard/today']);
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