import { AuthService } from './../../../../../Pages/Auth/auth.service';
import { NotificationService } from './../../../../../User/notifications/notifications.service';
import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { Observable, Subscription, catchError, distinctUntilChanged, forkJoin, interval, map, of, switchMap, tap } from 'rxjs';
import { Notifications } from "../../../../../User/notifications/notifications";

@Component({
  selector: 'app-nav-host-dashboard',
  imports: [RouterLink, RouterModule, CommonModule, Notifications],
  templateUrl: './nav-host-dashboard.html',
  styleUrl: './nav-host-dashboard.css',
  providers: [DatePipe]
})
export class NavHostDashboard implements OnInit, OnDestroy {
  isDropdownOpen = false;
  hostFname = '';
  hostLname = '';
  showNotifications = false;
  notifications: any[] = [];
  unreadCount = 0;
  isLoading = false;
  private notificationPolling?: Subscription;

  @ViewChild(Notifications) notificationComponent!: Notifications;

  constructor(
    private router: Router,
    private authService: AuthService, 
    private notificationService: NotificationService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.loadNotifications();
    this.startNotificationPolling();
  }

  ngOnDestroy(): void {
    this.stopNotificationPolling();
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
// nav.ts - Only the notification-related methods that need changes

// Replace the existing toggleNotifications method with this:
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

// Replace the existing markAllAsRead method with this:
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

// Replace the existing loadNotifications method with this:
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

// Replace the existing notification polling with this improved version:
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

  markAsRead(notificationId: number): void {
    const userId = this.authService.getUserId();
    if (!userId) return;

    this.notificationService.markAsRead(notificationId).pipe(
      catchError(err => {
        console.error('Error marking as read:', err);
        return of(null);
      })
    ).subscribe({
      next: () => {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification && !notification.isRead) {
          notification.isRead = true;
          this.unreadCount = Math.max(0, this.unreadCount - 1);
        }
      }
    });
  }


  onNotificationClick(notification: any): void {
    if (!notification.isRead) {
      this.markAsRead(notification.id);
    }
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
  }

  formatNotificationDate(dateString: string): string {
    return this.datePipe.transform(dateString, 'medium') || '';
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
    this.closeDropdown();
  }

  profileInitials(): string {
    const user = this.authService.currentUser;
    if (!user) return 'P';

    const first = user.firstName?.charAt(0).toUpperCase() || '';
    const last = user.lastName?.charAt(0).toUpperCase() || '';
    return first + last || 'P';
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    const menuContainer = document.querySelector('.menu-container');
    
    if (menuContainer && !menuContainer.contains(target)) {
      this.closeDropdown();
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    this.closeDropdown();
  }

  stopNotificationPolling(): void {
    if (this.notificationPolling) {
      this.notificationPolling.unsubscribe();
    }
  }
}