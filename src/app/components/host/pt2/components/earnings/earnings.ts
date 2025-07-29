import { Component, OnInit } from '@angular/core';
// import { BookingService } from '../../services/booking.service';
import { BookingResponseDto } from '../../models/booking.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

interface MonthlyEarning {
  month: string;
  amount: number;
  isCurrentMonth: boolean;
}

@Component({
  selector: 'app-earnings',
  templateUrl: './earnings.html',
  styleUrls: ['./earnings.css'],
  imports: [CommonModule, RouterModule],
  standalone: true
})
export class Earnings{}
// export class Earnings implements OnInit {
//   bookings: BookingResponseDto[] = [];

//   monthlyEarnings: MonthlyEarning[] = [];
//   currentMonthEarnings = 0;

//   ytdSummary = {
//     grossEarnings: 0,
//     adjustments: 0,
//     airbnbServiceFee: 0,
//     taxWithheld: 0,
//     total: 0
//   };

//   ytdDateRange = '';
//   hostId = 1; // 🔧 replace with actual host ID once JWT is wired

//   constructor(private bookingService: BookingService, private router: Router) {}

//   ngOnInit() {
//     this.bookingService.getBookingsByHost(this.hostId).subscribe(bookings => {
//       this.bookings = bookings;
//       this.processEarnings(bookings);
//     });
//   }

//   processEarnings(bookings: BookingResponseDto[]) {
//     const now = new Date();
//     const yearStart = new Date(now.getFullYear(), 0, 1);
//     const earningsByMonth = new Map<string, number>();
//     let gross = 0;

//     this.currentMonthEarnings = 0;

//     for (const booking of bookings) {
//       const created = new Date(booking.createdAt);
//       const amount = booking.totalAmount ?? 0;

//       if (booking.status === 'completed' && created >= yearStart) {
//         gross += amount;

//         const label = created.toLocaleString('default', { month: 'short', year: 'numeric' });
//         earningsByMonth.set(label, (earningsByMonth.get(label) || 0) + amount);

//         if (created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()) {
//           this.currentMonthEarnings += amount;
//         }
//       }
//     }

//     this.monthlyEarnings = Array.from(earningsByMonth, ([month, amount]) => ({
//       month,
//       amount,
//       isCurrentMonth: month === now.toLocaleString('default', { month: 'short', year: 'numeric' })
//     }));

//     this.ytdSummary.grossEarnings = gross;
//     this.ytdSummary.adjustments = -50; // optional manual entry
//     this.ytdSummary.airbnbServiceFee = gross * 0.03;
//     this.ytdSummary.taxWithheld = gross * 0.01;
//     this.ytdSummary.total = gross - this.ytdSummary.airbnbServiceFee - this.ytdSummary.taxWithheld + this.ytdSummary.adjustments;

//     this.ytdDateRange = `${yearStart.toLocaleDateString()} – ${now.toLocaleDateString()}`;
//   }

//   formatCurrency(amount: number): string {
//     return `$${amount.toFixed(2)}`;
//   }

//   // expandChart() {
//   //   // 🔧 handle modal or chart zoom here if needed
//   // }

//   goToHostDashboard(): void {
//     this.router.navigate(['/host/today']);
//   }
// }
