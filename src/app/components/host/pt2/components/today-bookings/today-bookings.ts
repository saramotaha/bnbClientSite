import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../services/booking.service';
import { BookingResponseDto } from '../../models/booking.model';
import { AuthService } from '../../../../../Pages/Auth/auth.service';
import { User } from '../../../../../Pages/Auth/user.model';

interface Booking {
  id: string;
  guestName: string;
  checkInDate: Date;
  checkOutDate: Date;
  propertyName: string;
  guestCount: number;
  nights: number;
  status: 'checking-out' | 'currently-hosting' | 'arriving-soon' | 'upcoming' | 'pending-review';
  avatar?: string;
}

@Component({
  selector: 'app-today-bookings',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  templateUrl: './today-bookings.html',
  styleUrls: ['./today-bookings.css']
})

export class TodayBookingsComponent implements OnInit {
  bookings: Booking[] = [];
  selectedTab: string = 'checking-out';
  isLoading: boolean = false;
  hostName: string = '';

  tabs = [
    { key: 'checking-out', label: 'Checking out', count: 0 },
    { key: 'currently-hosting', label: 'Currently hosting', count: 0 },
    { key: 'arriving-soon', label: 'Arriving soon', count: 0 },
    { key: 'upcoming', label: 'Upcoming', count: 0 },
    { key: 'pending-review', label: 'Pending review', count: 0 }
  ];

  constructor(
  private bookingService: BookingService,
  private authService: AuthService,
  private cdr: ChangeDetectorRef
) {}


ngOnInit(): void {
  this.isLoading = true;

  this.authService.currentUser$.subscribe(user => {
    const currentUser = this.authService.getUserProfile();
    console.log('👤 User Profile:', currentUser);

    const capitalize = (name: string): string =>
      name ? name.charAt(0).toUpperCase() + name.slice(1) : 'Host';

    if (currentUser?.firstName) {
      this.hostName = capitalize(currentUser.firstName);
    } else if (currentUser?.id) {
      this.authService.makeAuthenticatedRequest<User>(
        'GET',
        `http://localhost:7145/api/User/${currentUser.id}`
      ).subscribe({
        next: (userData) => {
          this.hostName = capitalize(userData.firstName || '');
          this.cdr.detectChanges(); // Ensure view updates
        },
        error: (err) => {
          console.error('Error fetching user info:', err);
          this.hostName = 'Host';
        }
      });
    } else {
      this.hostName = 'Host'; // Absolute fallback
    }

    if (user?.HostId) {
      const hostId = user.HostId;
      this.bookingService.getBookingsByHost(+hostId).subscribe({
        next: (allBookings) => {
          const todayBookings = allBookings.filter(this.isTodayBooking);
          this.bookings = todayBookings.map(dto => this.mapToBookingCardModel(dto));
          this.updateTabCounts();
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error fetching bookings:', error);
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      console.warn('Host ID missing from AuthService');
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  });
}




  isTodayBooking(dto: BookingResponseDto): boolean {
    const today = new Date();
    const start = new Date(dto.startDate);
    const end = new Date(dto.endDate);
    return start <= today && end >= today;
  }

  mapToBookingCardModel(dto: BookingResponseDto): Booking {
    return {
      id: dto.id.toString(),
      guestName: dto.guestName,
      checkInDate: new Date(dto.startDate),
      checkOutDate: new Date(dto.endDate),
      propertyName: dto.propertyTitle,
      guestCount: dto.totalGuests,
      nights: this.calculateNights(dto.startDate, dto.endDate),
      avatar: this.generateAvatar(dto.guestName),
      status: this.normalizeStatus(dto.status)
    };
  }

  normalizeStatus(raw: string): Booking['status'] {
    const cleaned = raw.replace(/[-_]/g, '').toLowerCase();
    const map: Record<string, Booking['status']> = {
      checkingout: 'checking-out',
      currentlyhosting: 'currently-hosting',
      arrivingsoon: 'arriving-soon',
      upcoming: 'upcoming',
      pendingreview: 'pending-review'
    };
    return map[cleaned] ?? 'upcoming';
  }

  generateAvatar(name: string): string {
    return name
      .split(' ')
      .map(part => part[0].toUpperCase())
      .join('');
  }

  calculateNights(start: Date | string, end: Date | string): number {
    const checkIn = new Date(start);
    const checkOut = new Date(end);
    return Math.max(1, Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)));
  }

updateTabCounts(): void {
  this.tabs = this.tabs.map(tab => ({
    ...tab,
    count: this.bookings.filter(b => b.status === tab.key).length
  }));
}

  selectTab(tabKey: string): void {
    this.selectedTab = tabKey;
  }

  getFilteredBookings(): Booking[] {
    return this.bookings.filter(booking =>
      booking.status === this.selectedTab.replace('-', '_') ||
      booking.status === this.selectedTab
    );
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  getEmptyStateMessage(): string {
    switch (this.selectedTab) {
      case 'checking-out': return "You don't have any guests checking out today.";
      case 'currently-hosting': return "You don't have any guests currently staying.";
      case 'arriving-soon': return "You don't have any guests arriving today or tomorrow.";
      case 'upcoming': return "You don't have any upcoming reservations.";
      case 'pending-review': return "You don't have any reviews pending.";
      default: return "No bookings found.";
    }
  }

  // Static test data used only during local testing
  /*
  loadMockData() {
    this.bookings = [
    {
        id: '1',
        guestName: 'Sarah Johnson',
        checkInDate: new Date('2025-07-23'),
        checkOutDate: new Date('2025-07-25'),
        propertyName: 'Downtown Loft Apartment',
        guestCount: 2,
        status: 'checking-out',
        nights: 2,
        avatar: 'SJ'
      },
      {
        id: '2',
        guestName: 'Michael Chen',
        checkInDate: new Date('2025-07-22'),
        checkOutDate: new Date('2025-07-28'),
        propertyName: 'Cozy Studio Near Beach',
        guestCount: 1,
        status: 'currently-hosting',
        nights: 6,
        avatar: 'MC'
      },
      {
        id: '3',
        guestName: 'Emma Rodriguez',
        checkInDate: new Date('2025-07-25'),
        checkOutDate: new Date('2025-07-30'),
        propertyName: 'Modern Family Home',
        guestCount: 4,
        status: 'arriving-soon',
        nights: 5,
        avatar: 'ER'
      },
      {
        id: '4',
        guestName: 'David Thompson',
        checkInDate: new Date('2025-07-26'),
        checkOutDate: new Date('2025-07-29'),
        propertyName: 'Garden View Apartment',
        guestCount: 3,
        status: 'upcoming',
        nights: 3,
        avatar: 'DT'
      },
      {
        id: '5',
        guestName: 'Lisa Wang',
        checkInDate: new Date('2025-07-20'),
        checkOutDate: new Date('2025-07-23'),
        propertyName: 'Historic Townhouse',
        guestCount: 2,
        status: 'pending-review',
        nights: 3,
        avatar: 'LW'
      }
    ];
  }
  */
}
