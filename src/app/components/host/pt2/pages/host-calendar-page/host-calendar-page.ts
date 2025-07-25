import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvailabilityCalendarComponent } from '../../components/availability-calendar/availability-calendar';
import { AvailabilityService } from '../../services/availability.service';
import { CalendarData, DateAvailability } from '../../models/calendar-data.model';
import { CreateAvailabilityDTO } from '../../models/availability.model';
import { RouterModule } from '@angular/router';
declare var bootstrap: any;

@Component({
  selector: 'app-host-calendar-page',
  standalone: true,
  imports: [CommonModule, AvailabilityCalendarComponent, RouterModule],
  templateUrl: './host-calendar-page.html',
  styleUrls: ['./host-calendar-page.css']
})
export class HostCalendarPage implements OnInit {
  propertyId = 4; // Example property ID, replace with actual logic to get the property ID
  properties: number[] = [1, 2, 3, 4]; // Example property IDs
  calendarData: CalendarData = {};
  currentMonthYear = { year: new Date().getFullYear(), month: new Date().getMonth() + 1 };

  constructor(private availabilityService: AvailabilityService) {}

  ngOnInit() {
    this.handleCalendarRequest(this.currentMonthYear);
  }

  handleCalendarRequest(monthYear: { year: number; month: number }) {
    this.currentMonthYear = monthYear;

    this.availabilityService.getByPropertyId(this.propertyId).subscribe(slots => {
      const calendarData: CalendarData = {};

      slots.forEach(slot => {
        const dateStr = slot.date.split('T')[0];
        const slotDate = new Date(dateStr);
        const slotMonth = slotDate.getMonth() + 1;
        const slotYear = slotDate.getFullYear();

        if (slotMonth === monthYear.month && slotYear === monthYear.year) {
          calendarData[dateStr] = {
            date: slotDate,
            price: slot.price,
            available: slot.isAvailable,
            blocked: !!slot.blockedReason,
            minStay: slot.minNights,
            maxStay: 365
          };
        }
      });

      this.calendarData = calendarData;
    });
  }

  handleAvailabilityUpdate(change: { date: Date; availability: DateAvailability }) {
    const dto: CreateAvailabilityDTO = {
      propertyId: this.propertyId,
      date: change.date.toISOString().split('T')[0],
      isAvailable: change.availability.available,
      blockedReason: change.availability.blocked ? 'manual block' : undefined,
      price: change.availability.price,
      minNights: change.availability.minStay ?? 1
    };

  this.availabilityService.addAvailability(dto).subscribe({
  next: res => {
    console.log('Saved availability:', res);
    this.handleCalendarRequest(this.currentMonthYear); // Refresh

    const toastEl = document.getElementById('availabilityToast');
    if (toastEl) {
      const toast = new bootstrap.Toast(toastEl);
      toast.show();
    }
  },
  error: err => {
    console.error('Save failed:', err);
    // Optionally show error toast
  }
});


  }

  onSelectProperty(propertyId: number) {
    this.propertyId = propertyId;
    this.handleCalendarRequest(this.currentMonthYear);
  }

  getSelectValue(event: Event): number {
    const target = event.target as HTMLSelectElement;
    return Number(target.value);
  }

  getInitialMonth(): Date {
    return new Date(this.currentMonthYear.year, this.currentMonthYear.month - 1);
  }
}
