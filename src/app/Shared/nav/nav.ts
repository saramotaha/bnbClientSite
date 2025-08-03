import { Component, ElementRef, HostListener, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../User/notifications/notifications.service';
import { AuthService } from '../../Pages/Auth/auth.service';
import { catchError, distinctUntilChanged, forkJoin, interval, map, Observable, of, Subscription, switchMap, tap } from 'rxjs';
import { Notifications } from "../../User/notifications/notifications";

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, Notifications],
  templateUrl: './nav.html',
  styleUrls: ['./nav.css'],
  providers: [DatePipe]
})
export class Nav implements OnInit, OnDestroy {
  // Base nav properties
  showNotifications = false;
  notifications: any[] = [];
  unreadCount = 0;
  isLoading = false;
  showUserMenu = false;
  private notificationPolling?: Subscription;

  // Nav properties
  showMainNav = false;
  isClosingMainNav = false;
  showCheckInCalendar = false;
  showCheckOutCalendar = false;
  showGuestsDropdown = false;
  searchQuery = '';
  checkInDate: Date | null = null;
  checkOutDate: Date | null = null;
  guests = {
    adults: 1,
    children: 0,
    infants: 0
  };
  currentMonth = new Date();
  checkInCalendarDays: any[] = [];
  checkOutCalendarDays: any[] = [];

  userMenuItems = [
    { name: 'Favorites', icon: 'bi-heart', route: 'favorites' },
    { name: 'Trips', icon: 'bi-airplane' },
    { name: 'Messages', icon: 'bi-chat', route: '/messages' },
    { name: 'Profile', icon: 'bi-person', route: 'UserTrips' },
    { name: 'Logout', icon: 'bi-box-arrow-right' }
  ];

  @ViewChild(Notifications) notificationComponent!: Notifications;

  constructor(
    private elementRef: ElementRef,
    private datePipe: DatePipe,
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {
    this.generateCalendar();
  }

  // NOTIFICATION METHODS
  ngOnInit(): void {
    this.loadNotifications();
    this.startNotificationPolling();
  }

  ngOnDestroy(): void {
    this.stopNotificationPolling();
  }

private loadNotifications(): void {
  const userId = this.authService.getUserId();
  if (!userId) return;

  this.isLoading = true;
  this.notificationService.getNotifications(Number(userId)).pipe(
    catchError(err => {
      console.error('Error loading notifications:', err);
      this.isLoading = false;
      return of([]);
    })
  ).subscribe({
    next: (data) => {
      this.notifications = data;
      this.updateUnreadCount(data);
      this.isLoading = false;
    }
  });
}

// Add this helper method:
private updateUnreadCount(notifications: any[]): void {
  this.unreadCount = notifications.filter((n: any) => !n.isRead).length;
}

  private startNotificationPolling(): void {
  const userId = this.authService.getUserId();
  if (!userId) return;

  this.notificationPolling = interval(15000).pipe(
    switchMap(() => this.notificationService.getNotifications(Number(userId))),
    catchError(err => {
      console.error('Polling error:', err);
      return of([]);
    })
  ).subscribe(notifications => {
    const previousUnreadCount = this.unreadCount;
    this.notifications = notifications;
    this.updateUnreadCount(notifications);
    
    // Only show badge animation if unread count increased (new notifications)
    if (this.unreadCount > previousUnreadCount) {
      this.animateNotificationBadge();
    }
  });
}

// Add this method for badge animation:
private animateNotificationBadge(): void {
  const badge = document.querySelector('.notification-badge');
  if (badge) {
    badge.classList.add('new-notification');
    setTimeout(() => {
      badge.classList.remove('new-notification');
    }, 1000);
  }
}


 // Add this method to your Nav class
markAllAsRead(): void {
  const userId = this.authService.getUserId();
  if (!userId) return;

  this.notificationService.markAllAsRead(Number(userId)).subscribe({
    next: () => {
      // Update local state
      this.notifications.forEach(n => n.isRead = true);
      this.unreadCount = 0;
      
      // Update notification component state
      if (this.notificationComponent) {
        this.notificationComponent.markAllAsRead();
      }
    },
    error: err => console.error('Error marking all as read:', err)
  });
}

// Add this new method to handle when all notifications are marked as read from the component
onAllNotificationsRead(): void {
  this.unreadCount = 0;
}
// Update the toggleNotifications method to use it correctly
toggleNotifications(event: Event): void {
  event.stopPropagation();
  this.showNotifications = !this.showNotifications;
  
  if (this.showNotifications && this.notificationComponent) {
    this.notificationComponent.isOpen = this.showNotifications;
    const userId = this.authService.getUserId();
    if (userId) {
      this.notificationComponent.loadNotifications(Number(userId));
      // Don't automatically mark as read when opening - let user control this
    }
  }
}

  private stopNotificationPolling(): void {
    this.notificationPolling?.unsubscribe();
  }

  // NAVIGATION METHODS
  toggleMainNav(event: Event): void {
    event.stopPropagation();
    
    if (this.showMainNav) {
      this.closeMainNavWithAnimation();
    } else {
      this.showMainNav = true;
      this.isClosingMainNav = false;
      if (this.showMainNav) {
        this.showNotifications = false;
        this.showUserMenu = false;
      }
    }
  }

  closeMainNavWithAnimation(): void {
    this.isClosingMainNav = true;
    setTimeout(() => {
      this.showMainNav = false;
      this.isClosingMainNav = false;
    }, 300);
  }

  toggleUserMenu(event: Event): void {
    event.stopPropagation();
    this.showUserMenu = !this.showUserMenu;
    if (this.showUserMenu) {
      if (this.showMainNav) {
        this.closeMainNavWithAnimation();
      }
      this.showNotifications = false;
    }
  }

  navigateTo(route: string): void {
    this.showUserMenu = false;
    if (route === '/logout') {
      this.handleLogout();
    } else {
      this.router.navigate([route]);
    }
  }

  handleLogout(): void {
    this.authService.logout();
    this.showUserMenu = false;
    this.router.navigate(['/login'])
      .then(() => console.log('Navigation to login completed'))
      .catch(err => console.error('Navigation error:', err));
  }

  // CALENDAR METHODS
  generateCalendar(): void {
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

  isToday(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  onCheckInHover(): void {
    this.showCheckInCalendar = true;
    this.showCheckOutCalendar = false;
    this.showGuestsDropdown = false;
  }

  onCheckOutHover(): void {
    this.showCheckOutCalendar = true;
    this.showCheckInCalendar = false;
    this.showGuestsDropdown = false;
  }

  onGuestsClick(): void {
    this.showGuestsDropdown = !this.showGuestsDropdown;
    this.showCheckInCalendar = false;
    this.showCheckOutCalendar = false;
  }

  selectCheckInDate(day: any): void {
    if (day.isPast) return;
    this.checkInDate = day.date;
    this.showCheckInCalendar = false;
  }

  selectCheckOutDate(day: any): void {
    if (day.isPast) return;
    this.checkOutDate = day.date;
    this.showCheckOutCalendar = false;
  }

  previousMonth(): void {
    this.currentMonth.setMonth(this.currentMonth.getMonth() - 1);
    this.generateCalendar();
  }

  nextMonth(): void {
    this.currentMonth.setMonth(this.currentMonth.getMonth() + 1);
    this.generateCalendar();
  }

  // GUEST METHODS
  adjustGuests(type: string, operation: string): void {
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

  // UTILITY METHODS
  formatDate(date: Date | null): string {
    if (!date) return '';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  getMonthYear(): string {
    return this.currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  getUserInitials(): string {
    const user = this.authService.getUserProfile();
    if (user && user.firstName) {
      const firstInitial = user.firstName.charAt(0);
      const lastInitial = user.lastName ? user.lastName.charAt(0) : '';
      return firstInitial + lastInitial;
    }
    return 'U';
  }

  onSearch(): void {
    console.log('Searching for:', this.searchQuery);
    this.closeMainNavWithAnimation();
  }

  // EVENT LISTENERS
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    
    // Handle dropdowns
    const notificationEl = this.elementRef.nativeElement.querySelector('.notification-dropdown');
    const notificationButton = this.elementRef.nativeElement.querySelector('.notification-button');
    const userMenuEl = this.elementRef.nativeElement.querySelector('.user-dropdown');
    const userMenuButton = this.elementRef.nativeElement.querySelector('.user-menu');
    const centerDiv = this.elementRef.nativeElement.querySelector('.centerdiv');
    
    if (!notificationEl?.contains(target) && !notificationButton?.contains(target)) {
      this.showNotifications = false;
    }
    if (!userMenuEl?.contains(target) && !userMenuButton?.contains(target)) {
      this.showUserMenu = false;
    }

    // Handle nav visibility
    if (!this.elementRef.nativeElement.querySelector('.airbnb-navbar')?.contains(target) && 
        !centerDiv?.contains(target) && this.showMainNav) {
      this.closeMainNavWithAnimation();
    }

    // Handle other dropdowns
    if (!this.elementRef.nativeElement.contains(target)) {
      this.showCheckInCalendar = false;
      this.showCheckOutCalendar = false;
      this.showGuestsDropdown = false;
    }
  }
}