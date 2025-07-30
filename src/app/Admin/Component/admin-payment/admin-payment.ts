import { Component, OnInit } from '@angular/core';
import { BookingPayoutService } from '../../Services/booking-payout-service';

@Component({
  selector: 'app-admin-payment',
  imports: [],
  templateUrl: './admin-payment.html',
  styleUrl: './admin-payment.css'
})
export class AdminPayment implements OnInit {


  Payments: any[] = [];



  constructor(private service: BookingPayoutService) { }
   ngOnInit(): void {
    this.service.GetAllBookingPayout().subscribe({
      next: (response) => {

        console.log(response);
        this.Payments = response ;


      }
    })
  }






  }



