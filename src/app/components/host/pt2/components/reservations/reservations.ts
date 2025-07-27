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
  private router = inject(Router);

  activeTab = signal<string>('upcoming');
  reservations = signal<BookingResponseDto[]>([]);
  loading = signal<boolean>(false);

  filteredReservations = computed(() => {
    const today = new Date();
    const all = this.reservations();
    const tab = this.activeTab();

    return all.filter(r => {
      switch (tab) {
        case 'upcoming':
          return new Date(r.startDate) >= today && r.status !== 'cancelled';
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

    const hostId = this.authService.getHostId();
    if (!hostId) {
      console.warn('Missing host ID. Make sure it’s stored during login.');
      this.loading.set(false);
      return;
    }

    this.bookingService.getBookingsByHost(+hostId).subscribe({
      next: (bookings) => {
        this.reservations.set(bookings);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load reservations:', err);
        this.reservations.set([]);
        this.loading.set(false);
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
