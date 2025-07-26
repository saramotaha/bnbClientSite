import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../services/booking.service'; 
import { BookingResponseDto } from '../../models/booking.model';
interface Booking {
  id: string;
  guestName: string;
  checkInDate: Date;
  checkOutDate: Date;
  propertyName: string;
  guestCount: number;
  status: 'checking-out' | 'currently-hosting' | 'arriving-soon' | 'upcoming' | 'pending-review';
  avatar?: string;
  nights: number;
}

@Component({
  selector: 'app-today-bookings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './today-bookings.html',
  styleUrls: ['./today-bookings.css']
})
export class TodayBookingsComponent implements OnInit {
  selectedTab: string = 'checking-out';
  bookings: Booking[] = [];

  tabs = [
    { key: 'checking-out', label: 'Checking out', count: 0 },
    { key: 'currently-hosting', label: 'Currently hosting', count: 0 },
    { key: 'arriving-soon', label: 'Arriving soon', count: 0 },
    { key: 'upcoming', label: 'Upcoming', count: 0 },
    { key: 'pending-review', label: 'Pending review', count: 0 }
  ];

  constructor(private bookingService: BookingService) {}

  ngOnInit() {
    //this.loadMockData();
    this.bookingService.getAll().subscribe(allBookings => {
  const todayBookings = allBookings.filter(this.isTodayBooking);
  this.bookings = todayBookings.map(this.mapToBookingCardModel);
  this.updateTabCounts();
});
  }

isTodayBooking(b: BookingResponseDto): boolean {
  const today = new Date();
  const start = new Date(b.startDate);
  const end = new Date(b.endDate);
  return start <= today && end >= today;
}

  loadMockData() {
    // Static test data
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

  updateTabCounts() {
    this.tabs.forEach(tab => {
      tab.count = this.bookings.filter(booking => 
        booking.status === tab.key.replace('-', '_') || 
        booking.status === tab.key
      ).length;
    });
  }
mapToBookingCardModel(dto: BookingResponseDto): Booking {
  return {
    id: dto.id.toString(), // assuming `Booking.id` is string
    guestName: dto.guestName,
    checkInDate: new Date(dto.startDate),
    checkOutDate: new Date(dto.endDate),
    propertyName: dto.propertyTitle,
    guestCount: dto.totalGuests,
    nights: this.calculateNights(dto.startDate, dto.endDate),
    avatar: dto.guestName.split(' ').map(n => n[0]).join(''), // fallback initials
    status: this.normalizeStatus(dto.status)
  };
}

normalizeStatus(raw: string): Booking['status'] {
  const cleanedRaw = raw.replace(/[-_]/g, '').toLowerCase();

  const statusMap: Record<string, Booking['status']> = {
    checkingout: 'checking-out',
    currentlyhosting: 'currently-hosting',
    arrivingsoon: 'arriving-soon',
    upcoming: 'upcoming',
    pendingreview: 'pending-review'
  };

  return statusMap[cleanedRaw] ?? 'upcoming'; // default fallback
}


calculateNights(start: string, end: string): number {
  const startDate = new Date(start);
  const endDate = new Date(end);
  return Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
}

  selectTab(tabKey: string) {
    this.selectedTab = tabKey;
  }

  getFilteredBookings(): Booking[] {
    return this.bookings.filter(booking => 
      booking.status === this.selectedTab.replace('-', '_') ||
      booking.status === this.selectedTab
    );
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  }

  getEmptyStateMessage(): string {
    switch(this.selectedTab) {
      case 'checking-out':
        return "You don't have any guests checking out today.";
      case 'currently-hosting':
        return "You don't have any guests currently staying.";
      case 'arriving-soon':
        return "You don't have any guests arriving today or tomorrow.";
      case 'upcoming':
        return "You don't have any upcoming reservations.";
      case 'pending-review':
        return "You don't have any reviews pending.";
      default:
        return "No bookings found.";
    }
  }
}