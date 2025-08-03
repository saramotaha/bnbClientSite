import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, map, Observable, tap } from "rxjs";

export interface Notification{
  id: number;
  userId: number;
  userName: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  senderId: number | null;
  senderName: string;
}
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private apiUrl = 'http://localhost:7145/api/Notification';
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  private unreadCountSubject = new BehaviorSubject<number>(0);

  notifications$ = this.notificationsSubject.asObservable();
  unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(private http: HttpClient) {}

  getNotifications(userId: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/user/${userId}`).pipe(
      map(notifications => notifications.map(n => ({
        ...n,
        isRead: n.isRead || false // Ensure isRead exists
      }))),
      tap(notifications => {
        this.notificationsSubject.next(notifications);
        this.updateUnreadCount(notifications);
      })
    );
  }

  private updateUnreadCount(notifications: Notification[]): void {
    const unreadCount = notifications.filter(n => !n.isRead).length;
    this.unreadCountSubject.next(unreadCount);
  }

  markAsRead(notificationId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${notificationId}/read`, {}).pipe(
      tap(() => {
        const notifications = this.notificationsSubject.value.map(n => 
          n.id === notificationId ? { ...n, isRead: true } : n
        );
        this.notificationsSubject.next(notifications);
        this.updateUnreadCount(notifications);
      })
    );
  }

  markAllAsRead(userId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/user/${userId}/mark-all-read`, {}).pipe(
      tap(() => {
        const notifications = this.notificationsSubject.value.map(n => 
          ({ ...n, isRead: true })
        );
        this.notificationsSubject.next(notifications);
        this.unreadCountSubject.next(0);
      })
    );
  }
}