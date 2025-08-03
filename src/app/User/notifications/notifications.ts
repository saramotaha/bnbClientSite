import { Component, OnInit, HostListener, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NotificationService } from './notifications.service';
import { AuthService } from '../../Pages/Auth/auth.service';
import { Observable, of, Subscription, interval } from 'rxjs';
import { catchError, take, tap, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css',
  providers: [DatePipe],
  exportAs: 'notifications',
  host: {
    '[class.show]': 'isOpen'
  }
})
export class Notifications implements OnInit, OnDestroy {
  notifications: any[] = [];
  unreadCount: number = 0;
  isLoading = true;
  page = 1;
  pageSize = 10;
  hasMore = true;
  currentUserId: number | null = null;
  private pollingSub?: Subscription;

  @Input() isOpen = false;
  @Output() allNotificationsRead = new EventEmitter<void>();

  constructor(
    private datepipe: DatePipe,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getCurrentUserId().subscribe(userId => {
      this.currentUserId = userId;
      if (userId) {
        this.loadNotifications(userId);
        this.startNotificationPolling(userId);
      }
    });
  }

  private getCurrentUserId(): Observable<number | null> {
    try {
      const userId = this.authService.getUserId();
      return of(userId ? Number(userId) : null);
    } catch (error) {
      console.error('Error getting user ID:', error);
      return of(null);
    }
  }

  loadNotifications(userId: number, loadMore = false): void {
    if (!userId) return;

    if (!loadMore) {
      this.page = 1;
      this.hasMore = true;
    }

    this.isLoading = true;
    this.notificationService.getNotifications(userId).pipe(
      take(1),
      catchError(err => {
        console.error('Error loading notifications:', err);
        this.isLoading = false;
        return of([]);
      })
    ).subscribe({
      next: (data) => {
        if (loadMore) {
          this.notifications = [...this.notifications, ...data];
        } else {
          this.notifications = data;
        }
        
        // Calculate unread count from notifications
        this.updateUnreadCount();
        this.hasMore = data.length === this.pageSize;
        this.isLoading = false;
      }
    });
  }

 // notifications.ts - Only the methods that need changes

// Replace the existing updateUnreadCount method:
private updateUnreadCount(): void {
  const newUnreadCount = this.notifications.filter(n => !n.isRead).length;
  
  // Only emit if the count actually changed
  if (this.unreadCount !== newUnreadCount) {
    this.unreadCount = newUnreadCount;
    this.allNotificationsRead.emit();
  }
}

// Replace the existing markAllAsRead method:
markAllAsRead(): void {
  if (!this.currentUserId) return;

  // Only mark as read if there are actually unread notifications
  const hasUnread = this.notifications.some(n => !n.isRead);
  if (!hasUnread) return;

  this.notificationService.markAllAsRead(this.currentUserId).pipe(
    take(1)
  ).subscribe({
    next: () => {
      // Update all notifications to read
      this.notifications.forEach(n => n.isRead = true);
      this.updateUnreadCount();
    },
    error: (err) => console.error('Error marking all as read:', err)
  });
}

// Replace the existing toggleDropdown method:
toggleDropdown(): void {
  this.isOpen = !this.isOpen;
  
  if (this.isOpen) {
    // Reload notifications if empty
    if (this.currentUserId && this.notifications.length === 0) {
      this.loadNotifications(this.currentUserId);
    }
    // Don't automatically mark as read - let user control this
  }
}

// Replace the existing startNotificationPolling method:
private startNotificationPolling(userId: number): void {
  this.pollingSub = interval(15000).pipe(
    switchMap(() => this.notificationService.getNotifications(userId)),
    catchError(err => {
      console.error('Polling error:', err);
      return of([]);
    }),
    tap(notifications => {
      const previousUnreadCount = this.unreadCount;
      this.notifications = notifications;
      this.updateUnreadCount();
      
      // If we're not currently viewing notifications and got new ones, don't mark as read
      if (!this.isOpen && this.unreadCount > previousUnreadCount) {
        // New notifications arrived - keep them unread
        console.log(`${this.unreadCount - previousUnreadCount} new notification(s) received`);
      }
    })
  ).subscribe();
}

  markAsRead(notificationId: number): void {
    if (!this.currentUserId) return;

    this.notificationService.markAsRead(notificationId).pipe(
      take(1)
    ).subscribe({
      next: () => {
        // Update local state
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
          notification.isRead = true;
          this.updateUnreadCount();
        }
      },
      error: (err) => console.error('Error marking as read:', err)
    });
  }

  onScroll(): void {
    if (!this.isLoading && this.hasMore && this.currentUserId) {
      this.page++;
      this.loadNotifications(this.currentUserId, true);
    }
  }

  formatDate(dateString: string): string {
    return this.datepipe.transform(dateString, 'MMMM d, y') || '';
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.notification-container') && !target.closest('.notification-dropdown')) {
      this.isOpen = false;
    }
  }

  ngOnDestroy(): void {
    this.pollingSub?.unsubscribe();
  }
}