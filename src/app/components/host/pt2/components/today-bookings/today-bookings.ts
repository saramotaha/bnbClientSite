import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../services/booking.service';
import { 
  BookingResponseDto,
  BookingCheckInStatusUpdate,
  BookingCheckOutStatusUpdate,
  BookingStatusUpdateDto
} from '../../models/booking.model';
import { AuthService } from '../../../../../Pages/Auth/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-today-bookings',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink],
  templateUrl: './today-bookings.html',
  styleUrls: ['./today-bookings.css']
})
export class TodayBookingsComponent implements OnInit {
  bookings: BookingResponseDto[] = [];
  selectedTab: string = 'checking-out';
  isLoading: boolean = false;
  hostName: string = '';

  tabs = [
    { key: 'checking-out', label: 'Checking out', count: 0 },
    { key: 'currently-hosting', label: 'Currently hosting', count: 0 },
    { key: 'arriving-soon', label: 'Arriving soon', count: 0 },
    { key: 'upcoming', label: 'Upcoming', count: 0 },
    // { key: 'pending-review', label: 'Pending review', count: 0 }
  ];

  constructor(
    private bookingService: BookingService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadBookings();
  }

loadBookings(): void {
  this.isLoading = true;
  this.authService.currentUser$.subscribe(user => {
    const hostId = user?.HostId;
    this.hostName = user?.firstName || '';
    if (hostId) {
      this.bookingService.getBookingsByHost(+hostId).subscribe({
        next: (bookings) => {
          console.log('Raw bookings data:', bookings); // Debug log
          this.bookings = bookings;
          console.log('Mapped bookings:', this.bookings); // Debug log
          this.updateTabCounts();
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error loading bookings:', err);
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      console.warn('No hostId found for user:', user); // Debug log
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  });
}

getFilteredBookings(): BookingResponseDto[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  console.log('Current tab:', this.selectedTab); // Debug log

  return this.bookings.filter(booking => {
    try {
      // Safely parse dates
      const checkInDate = booking.startDate ? new Date(booking.startDate) : new Date();
      const checkOutDate = booking.endDate ? new Date(booking.endDate) : new Date();

      // Reset time components for accurate comparison
      checkInDate.setHours(0, 0, 0, 0);
      checkOutDate.setHours(0, 0, 0, 0);

      console.log(`Booking ${booking.id}:`, { // Debug log
        status: booking.status,
        checkInStatus: booking.checkInStatus,
        checkOutStatus: booking.checkOutStatus,
        dates: `${checkInDate.toDateString()} - ${checkOutDate.toDateString()}`
      });

      // Case-insensitive status comparison
      const status = booking.status?.toLowerCase() || '';
      const checkInStatus = booking.checkInStatus?.toLowerCase() || '';
      const checkOutStatus = booking.checkOutStatus?.toLowerCase() || '';

      // Simplified filtering with fallbacks
      switch (this.selectedTab) {
        case 'checking-out':
          return status === 'completed' && checkOutStatus === 'completed';

        case 'currently-hosting':
          return (status === 'confirmed' || status === 'completed') &&
                 checkInStatus === 'completed' &&
                 checkOutStatus !== 'completed' &&
                 checkOutDate >= today; // Include today until checked out

        case 'arriving-soon':
          return (status === 'confirmed' || status === 'pending') &&
                 checkInStatus !== 'completed' &&
                 (checkInDate.getTime() === today.getTime() || 
                  checkInDate.getTime() === tomorrow.getTime());

        case 'upcoming':
        return status === 'confirmed' &&
         checkInStatus === 'pending' &&
         checkOutStatus === 'pending' &&
         checkInDate > today;

        case 'pending-review':
          return status === 'completed' && checkOutDate < today;

        default:
          return true; // Show all if tab not recognized
      }
    } catch (error) {
      console.error('Error filtering booking:', booking, error);
      return false;
    }
  });
}

 autoCheckOutBooking(bookingId: number): void {
  const statusDto: BookingStatusUpdateDto = { status: 'completed' };
  const checkOutDto: BookingCheckOutStatusUpdate = { checkOutStatus: 'completed' };
  
  this.bookingService.updateBookingStatus(bookingId, statusDto).subscribe({
    next: () => {
      this.bookingService.updateCheckOutStatus(bookingId, checkOutDto).subscribe({
        next: () => this.loadBookings(), // Refresh data
        error: (err) => console.error('Auto check-out failed:', err)
      });
    },
    error: (err) => console.error('Status update failed:', err)
  });
}

  checkInBooking(bookingId: number): void {
    this.isLoading = true;
    const checkInDto: BookingCheckInStatusUpdate = { checkInStatus: 'completed' };
    
    this.bookingService.updateCheckInStatus(bookingId, checkInDto).subscribe({
      next: () => {
        this.loadBookings();
      },
      error: (err) => {
        console.error('Check-in failed:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  checkOutBooking(bookingId: number): void {
    this.isLoading = true;
    const statusDto: BookingStatusUpdateDto = { status: 'completed' };
    const checkOutDto: BookingCheckOutStatusUpdate = { checkOutStatus: 'completed' };
    
    this.bookingService.updateBookingStatus(bookingId, statusDto).subscribe({
      next: () => {
        this.bookingService.updateCheckOutStatus(bookingId, checkOutDto).subscribe({
          next: () => this.loadBookings(),
          error: (err) => {
            console.error('Check-out status update failed:', err);
            this.isLoading = false;
            this.cdr.detectChanges();
          }
        });
      },
      error: (err) => {
        console.error('Status update failed:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Helper methods
  calculateNights(start: Date | string, end: Date | string): number {
    const checkIn = new Date(start);
    const checkOut = new Date(end);
    return Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  }

  generateAvatar(name: string): string {
    return name.split(' ').map(part => part[0].toUpperCase()).join('');
  }

  selectTab(tabKey: string): void {
    this.selectedTab = tabKey;
  }

  formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  getEmptyStateMessage(): string {
    switch (this.selectedTab) {
      case 'checking-out': return "No guests checking out today";
      case 'currently-hosting': return "No guests currently staying";
      case 'arriving-soon': return "No guests arriving today or tomorrow";
      case 'upcoming': return "No upcoming confirmed reservations";
      case 'pending-review': return "No reviews pending";
      default: return "No bookings found";
    }
  }

updateTabCounts(): void {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  this.tabs.forEach(tab => {
    tab.count = this.bookings.filter(booking => {
      try {
        const checkInDate = booking.startDate ? new Date(booking.startDate) : new Date();
        const checkOutDate = booking.endDate ? new Date(booking.endDate) : new Date();

        checkInDate.setHours(0, 0, 0, 0);
        checkOutDate.setHours(0, 0, 0, 0);

        const status = booking.status?.toLowerCase() || '';
        const checkInStatus = booking.checkInStatus?.toLowerCase() || '';
        const checkOutStatus = booking.checkOutStatus?.toLowerCase() || '';

        switch (tab.key) {
          case 'checking-out':
            return status === 'completed' && checkOutStatus === 'completed';

          case 'currently-hosting':
            return (status === 'confirmed' || status === 'completed') &&
                   checkInStatus === 'completed' &&
                   checkOutStatus !== 'completed' &&
                   checkOutDate >= today;

          case 'arriving-soon':
            return (status === 'confirmed' || status === 'pending') &&
                   checkInStatus !== 'completed' &&
                   (checkInDate.getTime() === today.getTime() || 
                    checkInDate.getTime() === tomorrow.getTime());

          case 'upcoming':
          return status === 'confirmed' &&
          checkInStatus === 'pending' &&
          checkOutStatus === 'pending' &&
          checkInDate > today;

          case 'pending-review':
            return status === 'completed' && checkOutDate < today;

          default:
            return false;
        }
      } catch (error) {
        console.error('Error counting booking:', booking, error);
        return false;
      }
    }).length;
  });

  console.log('Updated tab counts:', this.tabs); // Debug log
  this.cdr.detectChanges();
}

}