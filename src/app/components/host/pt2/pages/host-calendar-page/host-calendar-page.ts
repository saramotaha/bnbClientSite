import { Component, OnInit, ViewChild } from '@angular/core';
import { AvailabilityCalendarComponent } from '../../components/availability-calendar/availability-calendar';
// import { AvailabilityService } from '../../services/availability.service';
import { AuthService } from '../../../../../Pages/Auth/auth.service';
import { CalendarData, DateAvailability } from '../../models/calendar-data.model';
import { CreateAvailabilityDTO } from '../../models/availability.model';
import { CommonModule } from '@angular/common';
declare var bootstrap: any; 

@Component({
  selector: 'app-host-calendar-page',
  standalone: true,
  imports: [AvailabilityCalendarComponent, CommonModule],
  templateUrl: './host-calendar-page.html',
  styleUrls: ['./host-calendar-page.css']
})
export class HostCalendarPage {}
// export class HostCalendarPage implements OnInit {
//   @ViewChild(AvailabilityCalendarComponent) calendarComponent!: AvailabilityCalendarComponent;

//   calendarData: CalendarData = {};
//   propertyId = 4;
//   properties: number[] = [1, 2, 3, 4];
//   currentMonthYear = { year: new Date().getFullYear(), month: new Date().getMonth() + 1 };

//   constructor(
//     private availabilityService: AvailabilityService,
//     private authService: AuthService
//   ) {}

//   ngOnInit() {
//     this.handleCalendarRequest(this.currentMonthYear);
//   }

//  handleCalendarRequest({ year, month }: { year: number; month: number }) {
//   this.currentMonthYear = { year, month };
//   this.calendarComponent?.setLoading(true);

//   const timeoutFallback = setTimeout(() => {
//     this.calendarComponent?.setLoading(false);
//     this.showToast('errorToast'); // Optional toast fallback
//   }, 10000); // 10 seconds fallback

//   this.availabilityService.getCurrentHostAvailability(month, year).subscribe({
//     next: slots => {
//       clearTimeout(timeoutFallback);
//       const calendarData = this.mapSlotsToCalendarData(slots);
//       this.calendarData = calendarData;
//       this.calendarComponent?.updateCalendarData(calendarData);
//       this.calendarComponent?.setLoading(false);
//     },
//     error: err => {
//       clearTimeout(timeoutFallback);
//       console.error('Load failed:', err);
//       this.calendarComponent?.setLoading(false);
//       this.showToast('errorToast');
//     }
//   });
// }


//   handleAvailabilityUpdate(change: { date: Date; availability: DateAvailability }) {
//     const dto: CreateAvailabilityDTO = {
//       propertyId: this.propertyId,
//       date: change.date.toISOString().split('T')[0],
//       isAvailable: change.availability.available,
//       blockedReason: change.availability.blocked ? 'manual block' : undefined,
//       price: change.availability.price,
//       minNights: change.availability.minStay ?? 1
//     };

//     // Optimistic update
//     this.calendarData[dto.date] = change.availability;
//     this.calendarComponent?.updateCalendarData(this.calendarData);

//     this.availabilityService.addAvailability(dto).subscribe({
//       next: () => this.showToast('availabilityToast'),
//       error: () => this.showToast('errorToast')
//     });
//   }

//   showToast(toastId: string) {
//     const toastEl = document.getElementById(toastId);
//     if (toastEl) {
//       const toast = new bootstrap.Toast(toastEl);
//       toast.show();
//     }
//   }

//   mapSlotsToCalendarData(slots: CreateAvailabilityDTO[]): CalendarData {
//     const calendarData: CalendarData = {};
//     slots.forEach(slot => {
//       const dateStr = slot.date.split('T')[0];
//       calendarData[dateStr] = {
//         date: new Date(dateStr),
//         price: slot.price,
//         available: slot.isAvailable,
//         blocked: !!slot.blockedReason,
//         minStay: slot.minNights,
//         maxStay: 365
//       };
//     });
//     return calendarData;
//   }

//   onSelectProperty(propertyId: number) {
//     this.propertyId = propertyId;
//     this.handleCalendarRequest(this.currentMonthYear);
//   }

//   getInitialMonth(): Date {
//     return new Date(this.currentMonthYear.year, this.currentMonthYear.month - 1);
//   }

//   getSelectValue(event: Event): number {
//     return Number((event.target as HTMLSelectElement).value);
//   }
// }
