  import { Component, Input, OnInit, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
  import { IbookingCreate } from '../../../Booking/Model/ibooking-create';
  import { CommonModule } from '@angular/common';
  import { IPropertyList } from '../../../../Core/Models/iproperty-list';
  import { PropertyDetailsService } from '../../property-details/property-details-service';


  @Component({
    selector: 'app-propertydetails-calendar',
    imports:[CommonModule],
  templateUrl: './propertydetails-calendar.html',
    styleUrls: ['./propertydetails-calendar.css'],
  })
  export class PropertydetailsCalendar implements OnInit{
    constructor(private PropertyDetails:PropertyDetailsService ,private cdr:ChangeDetectorRef) { }
    @Input() bookingDetails!: IbookingCreate;
    @Input() propertyId:number =1;
  @Output() datesSelected = new EventEmitter<{ checkIn: string; checkOut: string }>();

    propertyDetails!:IPropertyList;
    checkInDate: Date | null = null;
    checkOutDate: Date | null = null;
    totalPrice: number = 0;
    rangeUnavailableMessage: string | null = null;
    currentMonth1: Date = new Date(); // e.g., July 2025
    currentMonth2: Date = new Date(new Date().setMonth(new Date().getMonth() + 1));
    days1: (Date | null)[][] = [];
    days2: (Date | null)[] []= [];

    ngOnInit() {
      this.generateCalendar();
      this.PropertyDetails.getPropertyDetailsById(this.propertyId).subscribe({
        next: (data) => {
          this.propertyDetails = data;
          this.mapAvailabilityDates();
          this.generateCalendar();
          console.log('Property Details AvailabilityDates:', this.propertyDetails.availabilityDates);
          this.cdr.detectChanges(); // Ensure the view updates with new data
        },
        error: (err) => {
          console.error('Error fetching property details:', err);
        }
      });
    }

  availableDatesMap: Map<string, boolean> = new Map();

  ngOnChanges(): void {
    if (this.propertyDetails?.availabilityDates) {
      this.mapAvailabilityDates();
    }
  }

      generateCalendar() {
    const days1Flat = this.getMonthDays(this.currentMonth1);
    const days2Flat = this.getMonthDays(this.currentMonth2);

    this.days1 = this.chunkArray(days1Flat, 7); // now it's Date[][] — weekly chunks
    this.days2 = this.chunkArray(days2Flat, 7); // same here
  }

  mapAvailabilityDates(): void {
    this.availableDatesMap.clear();

    const availabilityList = this.propertyDetails?.availabilityDates ?? [];

    for (const entry of availabilityList) {
      const key = new Date(entry.date).toLocaleDateString('en-CA');

      // Mark explicitly blocked/unavailable dates
      if (!entry.isAvailable) {
        this.availableDatesMap.set(key, false);  // only store blocked ones
      }
    }
  }
  isAvailable(date: Date | null): boolean {
    if (!date) return false;

    const key = date.toLocaleDateString('en-CA');

    // Default is available unless explicitly marked unavailable
    return this.availableDatesMap.get(key) !== false;
  }
  
  chunkArray<T>(arr: T[], size: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  }

    getMonthDays(monthDate: Date): (Date | null)[] {
      const days: (Date | null)[] = [];
      const year = monthDate.getFullYear();
      const month = monthDate.getMonth();

      const firstDay = new Date(year, month, 1);
      const totalDays = new Date(year, month + 1, 0).getDate();
      const startDayOfWeek = firstDay.getDay();

      // Padding before month starts
      for (let i = 0; i < startDayOfWeek; i++) {
        days.push(null);
      }

      // Fill in actual days
      for (let d = 1; d <= totalDays; d++) {
        days.push(new Date(year, month, d));
      }

      return days;
    }

  selectDate(day: Date | null): void {
    if (!day || !this.isAvailable(day)) return;

    this.rangeUnavailableMessage = null;

    if (!this.checkInDate || (this.checkInDate && this.checkOutDate)) {
      this.checkInDate = day;
      this.checkOutDate = null;
    } else if (this.checkInDate && !this.checkOutDate) {
      if (day > this.checkInDate) {
        if (this.isRangeAvailable(this.checkInDate, day)) {
          this.checkOutDate = day;
          this.totalPrice = this.getNights() * this.getNightlyRate();

          // ✅ Emit here after valid range
          this.datesSelected.emit({
            checkIn: this.checkInDate.toLocaleDateString('en-CA'),
            checkOut: this.checkOutDate.toLocaleDateString('en-CA')
          });

        } else {
          this.rangeUnavailableMessage = "Selected range includes unavailable dates. Please choose another range.";
          this.checkInDate = null;
          this.checkOutDate = null;
        }
      } else {
        this.checkInDate = day;
      }
    }
  }

  confirmSelection() {
    if (this.checkInDate && this.checkOutDate) {
      this.datesSelected.emit({
        checkIn: this.checkInDate.toLocaleDateString('en-CA'),
        checkOut: this.checkOutDate.toLocaleDateString('en-CA')
      });
    }
  }
  isRangeAvailable(start: Date, end: Date): boolean {
    let current = new Date(start);
    current.setDate(current.getDate() + 1); // Skip check-in day

    while (current < end) {
      const dateStr = current.toLocaleDateString('en-CA');

      // ❗ Only block if date is **explicitly set to false**
      if (this.availableDatesMap.get(dateStr) === false) {
        return false;
      }

      current.setDate(current.getDate() + 1);
    }

    return true;
  }
    isSelected(day: Date | null): boolean {
      if (!day) return false;
      if (this.checkInDate && this.checkOutDate) {
        return day >= this.checkInDate && day <= this.checkOutDate;
      } else if (this.checkInDate && !this.checkOutDate) {
        return day.getTime() === this.checkInDate.getTime();
      }
      return false;
    }
    clearDates(): void {
      this.checkInDate = null;
      this.checkOutDate = null;
      this.totalPrice = 0;
    }
    getNights(): number {
      if (!this.checkInDate || !this.checkOutDate) return 0;
      const diff = this.checkOutDate.getTime() - this.checkInDate.getTime();
      return Math.ceil(diff / (1000 * 60 * 60 * 24));
    }
    getNightlyRate(): number {
      return this.propertyDetails.pricePerNight; // Replace this with actual property nightly rate if dynamic
    }
    prev(): void {
      this.currentMonth1 = new Date(this.currentMonth1.setMonth(this.currentMonth1.getMonth() - 1));
      this.currentMonth2 = new Date(this.currentMonth2.setMonth(this.currentMonth2.getMonth() - 1));
      this.generateCalendar();
    }
    next(): void {
      this.currentMonth1 = new Date(this.currentMonth1.setMonth(this.currentMonth1.getMonth() + 1));
      this.currentMonth2 = new Date(this.currentMonth2.setMonth(this.currentMonth2.getMonth() + 1));
      this.generateCalendar();
    }
  getWeeks(days: (Date | null)[]): (Array<Date | null>)[] {
    const weeks: (Array<Date | null>)[] = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }
    return weeks;
  }
  getMonthName(monthIndex: number): string {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[monthIndex] || '';
  }

    isStartDate(date: Date | null): boolean {
    if (!date || !this.checkInDate) return false;
    return date.getTime() === this.checkInDate.getTime();
  }

  isEndDate(date: Date | null): boolean {
    if (!date || !this.checkOutDate) return false;
    return date.getTime() === this.checkOutDate.getTime();
  }
  isInRange(date: Date | null): boolean {
  if (!date || !this.checkInDate || !this.checkOutDate) return false;

  const time = date.getTime();
  const startTime = this.checkInDate.getTime();
  const endTime = this.checkOutDate.getTime();

  if (time <= startTime || time >= endTime) return false;

  const key = date.toLocaleDateString('en-CA');
  return this.availableDatesMap.get(key) !== false; // ✅ not explicitly blocked
}

  }

