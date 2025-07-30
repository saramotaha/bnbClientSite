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
  filteredPayments: any[] = [];




  constructor(private service: BookingPayoutService) { }
   ngOnInit(): void {
    this.service.GetAllBookingPayout().subscribe({
      next: (response) => {

        console.log(response);
        this.Payments = response;
        this.filteredPayments = [...this.Payments]; // Initialize filteredPayments



      }
    })
  }



   filterPayments(event: Event) {
    const selectedStatus = (event.target as HTMLSelectElement).value;
    console.log("Selected filter:", selectedStatus);

    if (selectedStatus === 'all') {
      this.filteredPayments = [...this.Payments]; // Reset to all
    } else {
      this.filteredPayments = this.Payments.filter(p =>
        p.status?.toLowerCase() === selectedStatus.toLowerCase()
      );
    }
  }


  ReversePayment(id: number) {
    this.service.ReleasePayout(id).subscribe({
      next: (response) => {

        console.log(response);

      }
    })
  }






  }



