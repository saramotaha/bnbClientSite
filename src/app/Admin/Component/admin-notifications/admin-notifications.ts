import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormControlName, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AdminNotificationService } from '../../Services/admin-notification-service';
import { IAdminNotifications } from '../../Models/iadmin-notifications';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-notifications',
  imports: [ReactiveFormsModule , CommonModule],
  templateUrl: './admin-notifications.html',
  styleUrl: './admin-notifications.css'
})
export class AdminNotifications implements OnInit {
   data?: IAdminNotifications;
  AdminNotifications!: IAdminNotifications[];
  NotificationsToAdmin!: IAdminNotifications[];
  constructor(private service:AdminNotificationService , private cdr:ChangeDetectorRef) {}
  ngOnInit(): void {
    this.service.GetAdminNotifications().subscribe({
      next: (response) => {
        this.AdminNotifications = response;
        console.log(AdminNotifications);

        this.cdr.detectChanges();

      }
    })


    this.service.GetNotificationsToAdmin(5).subscribe({
      next: (response) => {
        this.NotificationsToAdmin = response;
        this.cdr.detectChanges();

      }
    })
  }




  notificationForm = new FormGroup({
    userId: new FormControl(''),
    senderId:new FormControl('5'),
    message:new FormControl('')
  })

  submitForm() {
    const formData = this.notificationForm.value;
    this.data={
    "userId": +(formData?.userId??0),
    "senderId": +(formData.senderId??0),
     "message": formData?.message??''
}


    this.service.AddNotification(this.data).subscribe({
      next: (response) => {
        console.log(response);


        this.cdr.detectChanges();

      }
    })




  }


}
