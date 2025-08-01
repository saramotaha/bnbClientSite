import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

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

@Injectable({
    providedIn:'root'
})
export class NotificationService{
    private Apiurl= 'http://localhost:7145/api/Notification/user';
    constructor(private http:HttpClient){}

    getNotifications(userId:number):Observable<Notification[]>{
        return this.http.get<Notification[]>(`${this.Apiurl}/${userId}`);
    }

    markAsRead(notificationId:number):Observable<any>{
        return this.http.patch(`${this.Apiurl}/${notificationId}/read`,{});
    }
    
    deleteNotifications(notificationId:number):Observable<void>{
        return this.http.delete<void>(`${this.Apiurl}/${notificationId}`)
    }
}
