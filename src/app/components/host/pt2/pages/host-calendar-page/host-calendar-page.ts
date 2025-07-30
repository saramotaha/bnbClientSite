import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { AvailabilityCalendarComponent } from '../../components/availability-calendar/availability-calendar';
import { AvailabilityService } from '../../services/availability.service';
import { PropertyService } from '../../services/property.service';
import { AuthService } from '../../../../../Pages/Auth/auth.service';

import { CalendarData, DateAvailability } from '../../models/calendar-data.model';
import { CreateAvailabilityDTO } from '../../models/availability.model';
import { Property } from '../../../pt1/Models/property.model';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
declare var bootstrap: any;

@Component({
  selector: 'app-host-calendar-page',
  standalone: true,
  imports: [AvailabilityCalendarComponent, CommonModule, FormsModule],
  templateUrl: './host-calendar-page.html',
  styleUrls: ['./host-calendar-page.css']
})

export class HostCalendarPage implements OnInit {
  @ViewChild(AvailabilityCalendarComponent) calendarComponent!: AvailabilityCalendarComponent;

  calendarData: CalendarData = {};
  selectedPropertyId!: number;
  properties: Property[] = [];
  currentMonthYear = { year: new Date().getFullYear(), month: new Date().getMonth() + 1 };

  constructor(
    private availabilityService: AvailabilityService,
    private propertyService: PropertyService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadProperties();
    this.propertyService.getAllByHost().subscribe(res => this.properties = res);
  }

  loadProperties() {
    this.propertyService.getAllByHost().subscribe({
      next: props => {
        this.properties = props;
        if (props.length > 0) {
          this.selectedPropertyId = props[0].id;
          this.handleCalendarRequest(this.currentMonthYear);
        }
      },
      error: err => {
        console.error('Property fetch failed:', err);
        this.showToast('errorToast');
      }
    });
  }

 handleCalendarRequest({ year, month }: { year: number; month: number }) {
  this.currentMonthYear = { year, month };
  this.calendarComponent?.setLoading(true);

  this.availabilityService.getCurrentHostAvailability(month, year).subscribe({
    next: slots => {
      const calendarData = this.mapSlotsToCalendarData(slots);
      this.calendarData = calendarData;
      this.calendarComponent?.updateCalendarData(calendarData);
      this.calendarComponent?.setLoading(false);
      this.cdr.detectChanges();
    },
    error: err => {
      console.error('Load failed:', err);
      this.calendarComponent?.setLoading(false);
      this.showToast('errorToast');
    }
  });
}

  onSelectProperty(propertyId: number): void {
    this.selectedPropertyId = propertyId;

    this.availabilityService.getByPropertyId(propertyId).subscribe({
      next: (dtoArray: CreateAvailabilityDTO[]) => {
        const calendarFormatted: CalendarData = {};

        dtoArray.forEach(dto => {
          const dateObj = new Date(dto.date);

          calendarFormatted[dto.date] = {
            date: dateObj,
            price: dto.price,
            available: dto.isAvailable,
            blocked: !!dto.blockedReason,
            minStay: dto.minNights,
            maxStay: undefined,
            isWeekend: [0, 6].includes(dateObj.getDay()),
            isEditing: false
          };
        });

        this.calendarData = calendarFormatted;
        this.calendarComponent?.updateCalendarData(calendarFormatted);
        this.cdr.detectChanges(); // 🔔 Ensure view reflects new data
      },
      error: err => {
        console.error('Error loading availability:', err);
        this.showToast('errorToast');
      }
    });
  }

handleAvailabilityUpdate(change: { date: Date; availability: DateAvailability }) {
  const dateStr = new Date(change.date).toISOString().split('T')[0];
  
  this.availabilityService.getByPropertyId(this.selectedPropertyId).subscribe({
    next: (availabilities) => {
      const existing = availabilities.find(a => a.date.split('T')[0] === dateStr);
      
      // If no existing record, create new
      if (!existing || existing.id === undefined) {
        const newDto: CreateAvailabilityDTO = {
          propertyId: this.selectedPropertyId,
          date: dateStr,
          isAvailable: change.availability.available,
          blockedReason: change.availability.blocked ? 'manual block' : undefined,
          price: change.availability.price,
          minNights: change.availability.minStay ?? 1
        };
        
        this.availabilityService.addAvailability(newDto).subscribe({
          next: () => this.showToast('availabilityToast', `Added: ${newDto.date}`),
          error: (err) => this.handleError(err)
        });
        return;
      }

      // TypeScript now knows existing.id is definitely a number here
      const updateDto: CreateAvailabilityDTO = {
        id: existing.id,
        propertyId: this.selectedPropertyId,
        date: dateStr,
        isAvailable: change.availability.available,
        blockedReason: change.availability.blocked ? 'manual block' : undefined,
        price: change.availability.price,
        minNights: change.availability.minStay ?? 1
      };

      this.availabilityService.updateAvailability(existing.id, updateDto).subscribe({
        next: () => this.showToast('availabilityToast', `Updated: ${updateDto.date}`),
        error: (err) => this.handleError(err)
      });
    },
    error: (err) => this.handleError(err)
  });
}

private handleError(err: any) {
  console.error('Availability operation failed:', err);
  this.showToast('errorToast');
}

  mapSlotsToCalendarData(slots: CreateAvailabilityDTO[]): CalendarData {
    const data: CalendarData = {};
    slots.forEach(slot => {
      const dateStr = slot.date.split('T')[0];
      const dateObj = new Date(dateStr);
      data[dateStr] = {
        date: dateObj,
        price: slot.price,
        available: slot.isAvailable,
        blocked: !!slot.blockedReason,
        minStay: slot.minNights,
        maxStay: 365,
        isWeekend: [0, 6].includes(dateObj.getDay()),
        isEditing: false
      };
    });
    return data;
  }

  showToast(toastId: string, message?: string) {
    const toastEl = document.getElementById(toastId);

    if (toastEl) {
      if (message) {
        const toastBody = toastEl.querySelector('.toast-body');
        if (toastBody) toastBody.textContent = message;
      }

      const toast = new bootstrap.Toast(toastEl);
      toast.show();
    }
  }

  getInitialMonth(): Date {
    return new Date(this.currentMonthYear.year, this.currentMonthYear.month - 1);
  }

  getSelectValue(event: Event): number {
    return Number((event.target as HTMLSelectElement).value);
  }
}
