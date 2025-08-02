import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { noop, Observable } from 'rxjs';
import { IAdminNotifications } from '../Models/iadmin-notifications';

@Injectable({
  providedIn: 'root'
})
export class AdminNotificationService {

  baseUrl:string='http://localhost:7145/api/Notification'
  constructor(private http: HttpClient) { }

  AddNotification(NotificationBody:IAdminNotifications):Observable<IAdminNotifications> {
   return this.http.post<IAdminNotifications>(`${this.baseUrl}`, NotificationBody);
  }


  GetAdminNotifications():Observable<IAdminNotifications[]> {
    return this.http.get<IAdminNotifications[]>(`${this.baseUrl}/GetAdminNotifications`);
  }

  GetNotificationsToAdmin(id:number):Observable<IAdminNotifications[]> {
    return this.http.get<IAdminNotifications[]>(`${this.baseUrl}/user/${id}`);
  }

}
