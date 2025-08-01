import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NotificationService } from './notifications.service';
import { AuthService } from '../../Pages/Auth/auth.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule], // Only need CommonModule (no NgIf/NgFor)
  templateUrl: './notifications.html',
  styleUrl: './notifications.css',
  providers: [DatePipe]
})
export class Notifications implements OnInit {
  Notifications: any[] = [];
  isLoading = true;
  
  constructor(
    private datepipe: DatePipe,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    this.loadNotifications(Number(userId));
  }
    deleteNotification(notificationId: number): void {
    this.notificationService.deleteNotifications(notificationId).subscribe({
      next: () => {
        // Remove the deleted notification from the local array
        this.Notifications = this.Notifications.filter(
          Notifications => Notifications.id !== notificationId
        );
        console.log('Notification deleted successfully');
      },
      error: (err) => {
        console.error('Error deleting notification:', err);
      }
    });
  }

  loadNotifications(userId: number): void {
    this.notificationService.getNotifications(userId).subscribe({
      next: (data) => {
        this.Notifications = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading notifications:', err);
        this.isLoading = false;
      }
    });
  }

  formatDate(dateString: string): string {
    return this.datepipe.transform(dateString, 'MMMM d, y') || '';
  }
}