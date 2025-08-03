import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
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
  styleUrls: ['./notifications.css'],
  providers: [DatePipe]
})
export class Notifications implements OnInit, OnDestroy {
  notifications: any[] = [];
  unreadCount: number = 0;
  isLoading = true;
  isOpen = false;
  currentUserId: number | null = null;
  private pollingSub?: Subscription;

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

  toggleDropdown(event: Event): void {
    event.stopPropagation();
    this.isOpen = !this.isOpen;
    if (this.isOpen && this.currentUserId) {
      this.loadNotifications(this.currentUserId);
    }
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

  loadNotifications(userId: number): void {
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
        this.notifications = data;
        this.unreadCount = data.filter(n => !n.isRead).length;
        this.isLoading = false;
      }
    });
  }

  private startNotificationPolling(userId: number): void {
    this.pollingSub = interval(15000).pipe(
      switchMap(() => this.notificationService.getNotifications(userId)),
      tap(notifications => {
        this.notifications = notifications;
        this.unreadCount = notifications.filter(n => !n.isRead).length;
      })
    ).subscribe();
  }

  markAsRead(notificationId: number): void {
    if (!this.currentUserId) return;

    this.notificationService.markAsRead(notificationId).pipe(
      take(1)
    ).subscribe({
      next: () => {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
          notification.isRead = true;
          this.unreadCount = this.notifications.filter(n => !n.isRead).length;
        }
      },
      error: (err) => console.error('Error marking as read:', err)
    });
  }

  markAllAsRead(): void {
    if (!this.currentUserId) return;

    this.notificationService.markAllAsRead(this.currentUserId).pipe(
      take(1)
    ).subscribe({
      next: () => {
        this.notifications.forEach(n => n.isRead = true);
        this.unreadCount = 0;
      },
      error: (err) => console.error('Error marking all as read:', err)
    });
  }

  formatDate(dateString: string): string {
    return this.datepipe.transform(dateString, 'short') || '';
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.notification-container')) {
      this.isOpen = false;
    }
  }

  ngOnDestroy(): void {
    this.pollingSub?.unsubscribe();
  }
}