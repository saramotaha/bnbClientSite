import { Component, OnInit, HostListener, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NotificationService } from './notifications.service';
import { AuthService } from '../../Pages/Auth/auth.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css',
  providers: [DatePipe],
    exportAs: 'notifications' ,
      host: {
    '[class.show]': 'isOpen'
  }
})
export class Notifications implements OnInit {
  Notifications: any[] = [];
  isLoading = true;
@Input() isOpen = false;
  page = 1;
  pageSize = 10;
  hasMore = true;

  constructor(
    private datepipe: DatePipe,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    this.loadNotifications(Number(userId));
  }

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen && this.Notifications.length === 0) {
      const userId = this.authService.getUserId();
      this.loadNotifications(Number(userId));
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.notification-container') && !target.closest('.notification-dropdown')) {
      this.isOpen = false;
    }
  }

  deleteNotification(notificationId: number): void {
    this.notificationService.deleteNotifications(notificationId).subscribe({
      next: () => {
        this.Notifications = this.Notifications.filter(
          notification => notification.id !== notificationId
        );
        console.log('Notification deleted successfully');
      },
      error: (err) => {
        console.error('Error deleting notification:', err);
      }
    });
  }

  loadNotifications(userId: number, loadMore = false): void {
    if (!loadMore) {
      this.page = 1;
      this.hasMore = true;
    }

    this.isLoading = true;
    this.notificationService.getNotifications(userId).subscribe({
      next: (data) => {
        if (loadMore) {
          this.Notifications = [...this.Notifications, ...data];
        } else {
          this.Notifications = data;
        }
        
        this.hasMore = data.length === this.pageSize;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading notifications:', err);
        this.isLoading = false;
      }
    });
  }

  onScroll(): void {
    if (!this.isLoading && this.hasMore) {
      this.page++;
      const userId = this.authService.getUserId();
      this.loadNotifications(Number(userId), true);
    }
  }

  formatDate(dateString: string): string {
    return this.datepipe.transform(dateString, 'MMMM d, y') || '';
  }
}