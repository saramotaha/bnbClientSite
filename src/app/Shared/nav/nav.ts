import { routes } from './../../app.routes';
import { CommonModule, DatePipe } from '@angular/common';
import { Component, ElementRef, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FilterHomesServices } from '../../Core/Services/filter-homes-services';
import { Router } from '@angular/router';
import { NotificationService } from "../../User/notifications/notifications.service";
import { AuthService } from "../../Pages/Auth/auth.service";

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
  providers: [DatePipe]
})
export class Nav {
  // Navigation state
  showCheckInCalendar = false;
  showCheckOutCalendar = false;
  showGuestsDropdown = false;
  showUserMenu = false;
  showNotifications = false;

  // Search state
  searchQuery = '';
  checkInDate: Date | null = null;
  checkOutDate: Date | null = null;
  guests = {
    adults: 1,
    children: 0,
    infants: 0
  };

  // Calendar state
  currentMonth = new Date();
  checkInCalendarDays: any[] = [];
  checkOutCalendarDays: any[] = [];

  // Notification state
  notifications: any[] = [];
  unreadCount = 0;
  isLoading = false;

  constructor(
    private elementRef: ElementRef,
    private service: FilterHomesServices,
    private router: Router,
    private notificationService: NotificationService,
    private authService: AuthService,
    private datePipe: DatePipe
  ) {
    this.generateCalendar();
    this.loadNotifications();
  }

  // Notification methods
  toggleNotifications(event: Event): void {
    event.stopPropagation();
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications) {
      this.loadNotifications();
    }
  }

  loadNotifications(): void {
    const userId = this.authService.getUserId();
    if (!userId) return;

    this.isLoading = true;
    this.notificationService.getNotifications(Number(userId)).subscribe({
      next: (data) => {
        this.notifications = data;
        this.unreadCount = data.filter((n: any) => !n.is_read).length;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading notifications:', err);
        this.isLoading = false;
      }
    });
  }

  deleteNotification(notificationId: number, event: Event): void {
    event.stopPropagation();
    this.notificationService.deleteNotifications(notificationId).subscribe({
      next: () => {
        this.notifications = this.notifications.filter(n => n.id !== notificationId);
        this.unreadCount = this.notifications.filter(n => !n.is_read).length;
      },
      error: (err) => console.error('Error deleting notification:', err)
    });
  }

  formatNotificationDate(dateString: string): string {
    return this.datePipe.transform(dateString, 'medium') || '';
  }

  // Calendar methods
  generateCalendar() {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    this.checkInCalendarDays = [];
    this.checkOutCalendarDays = [];

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      const dayInfo = {
        date: date,
        day: date.getDate(),
        isCurrentMonth: date.getMonth() === month,
        isToday: this.isToday(date),
        isSelected: false,
        isPast: date < new Date(new Date().setHours(0, 0, 0, 0))
      };

      this.checkInCalendarDays.push({ ...dayInfo });
      this.checkOutCalendarDays.push({ ...dayInfo });
    }
  }

  // Other methods
  @HostListener('document:click', ['$event'])
onDocumentClick(event: MouseEvent) {
  const target = event.target as HTMLElement;
  const notificationEl = this.elementRef.nativeElement.querySelector('.notification-dropdown');
  const notificationButton = this.elementRef.nativeElement.querySelector('.notification-button');
  const userMenuEl = this.elementRef.nativeElement.querySelector('.user-dropdown');
  const userMenuButton = this.elementRef.nativeElement.querySelector('.user-menu');

  if (!notificationEl?.contains(target) && !notificationButton?.contains(target)) {
    this.showNotifications = false;
  }

  if (!userMenuEl?.contains(target) && !userMenuButton?.contains(target)) {
    this.showUserMenu = false;
  }

  if (!this.elementRef.nativeElement.contains(event.target)) {
    this.showCheckInCalendar = false;
    this.showCheckOutCalendar = false;
    this.showGuestsDropdown = false;
  }
}

  isToday(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  onCheckInHover() {
    this.showCheckInCalendar = true;
    this.showCheckOutCalendar = false;
    this.showGuestsDropdown = false;
  }

  onCheckOutHover() {
    this.showCheckOutCalendar = true;
    this.showCheckInCalendar = false;
    this.showGuestsDropdown = false;
  }

  onGuestsClick() {
    this.showGuestsDropdown = !this.showGuestsDropdown;
    this.showCheckInCalendar = false;
    this.showCheckOutCalendar = false;
  }

  selectCheckInDate(day: any) {
    if (day.isPast) return;
    this.checkInDate = day.date;
    this.showCheckInCalendar = false;
  }

  selectCheckOutDate(day: any) {
    if (day.isPast) return;
    this.checkOutDate = day.date;
    this.showCheckOutCalendar = false;
  }

  previousMonth() {
    this.currentMonth.setMonth(this.currentMonth.getMonth() - 1);
    this.generateCalendar();
  }

  nextMonth() {
    this.currentMonth.setMonth(this.currentMonth.getMonth() + 1);
    this.generateCalendar();
  }

  adjustGuests(type: string, operation: string) {
    if (operation === 'increment') {
      this.guests[type as keyof typeof this.guests]++;
    } else if (operation === 'decrement' && this.guests[type as keyof typeof this.guests] > 0) {
      if (type === 'adults' && this.guests.adults === 1) return;
      this.guests[type as keyof typeof this.guests]--;
    }
  }

  getTotalGuests(): number {
    return this.guests.adults + this.guests.children;
  }

  formatDate(date: Date | null): string {
    if (!date) return '';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  getMonthYear(): string {
    return this.currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  onSearch() {
    this.service.setFilters({
      location: this.searchQuery,
      startDate: this.checkInDate,
      endDate: this.checkOutDate,
      guests: this.getTotalGuests()
    });
    this.router.navigate(['/ViewAllHomes']);
  }
  toggleUserMenu(event: Event) {
  event.stopPropagation();
  this.showUserMenu = !this.showUserMenu;
  if (this.showUserMenu) {
    this.showNotifications = false;
    }
  }
userMenuItems = [
  { name: 'Favorites',  icon: 'bi-heart', route:'favorites' },
  { name: 'Trips',  icon: 'bi-airplane' },
  { name: 'Messages',  icon: 'bi-chat' ,route: '/messages'},
  { name: 'Profile',  icon: 'bi-person',route :'UserTrips' },
  { name: 'Logout',  icon: 'bi-box-arrow-right' }
];
// Update in nav.ts
toggleMenuItem(item: any) {
  if (item.name === 'Logout') {
    this.handleLogout();
    return;
  }
  item.checked = !item.checked;
  this.navigateTo(item.route);
}
navigateTo(route: string) {
  this.showUserMenu = false;
  if (route === '/logout') {
    this.handleLogout();
  } else {
    this.router.navigate([route]);
  }
}

handleLogout() {
  // Add your logout logic here
  console.log('Logging out...');
  // Example: this.authService.logout();
  this.showUserMenu = false;
}
}