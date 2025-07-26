import { Component,Input, OnInit } from '@angular/core';
import { IbookingCreate } from '../../../Booking/Model/ibooking-create';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-propertydetails-calendar',
  imports:[CommonModule],
  templateUrl: './propertydetails-calendar.html',
  styleUrls: ['./propertydetails-calendar.css'],
})
export class PropertydetailsCalendar implements OnInit{
 
 checkInDate: Date | null = null;
  checkOutDate: Date | null = null;
  totalPrice: number = 0;

  currentMonth1: Date = new Date(); // e.g., July 2025
  currentMonth2: Date = new Date(new Date().setMonth(new Date().getMonth() + 1));

  days1: (Date | null)[][] = [];
  days2: (Date | null)[] []= [];

  ngOnInit() {
    this.generateCalendar();
  }

/*   generateCalendar() {
    this.days1 = this.getMonthDays(this.currentMonth1);
    this.days2 = this.getMonthDays(this.currentMonth2);
  } */


    generateCalendar() {
  const days1Flat = this.getMonthDays(this.currentMonth1);
  const days2Flat = this.getMonthDays(this.currentMonth2);

  this.days1 = this.chunkArray(days1Flat, 7); // now it's Date[][] — weekly chunks
  this.days2 = this.chunkArray(days2Flat, 7); // same here
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
    if (!day) return;

    if (!this.checkInDate || (this.checkInDate && this.checkOutDate)) {
      this.checkInDate = day;
      this.checkOutDate = null;
    } else if (this.checkInDate && !this.checkOutDate) {
      if (day > this.checkInDate) {
        this.checkOutDate = day;
        this.totalPrice = this.getNights() * this.getNightlyRate(); // Use real rate if available
      } else {
        this.checkInDate = day;
      }
    }
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
    return 100; // Replace this with actual property nightly rate if dynamic
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
  return date > this.checkInDate && date < this.checkOutDate;
}
}


  //--------------------------
/* @Input() pricePerNight: number = 100;

  monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  displayedDate = new Date(); // current month being shown
  months: Date[] = [];

  checkInDate: Date | null = null;
  checkOutDate: Date | null = null;
  totalPrice = 0;
  days1: (Date | null)[] = [];
days2: (Date | null)[] = [];
currentMonth1!: Date;
currentMonth2!: Date;
  ngOnInit() {
     const now = new Date();
    this.generateTwoMonths();
     this.currentMonth1 = new Date(now.getFullYear(), now.getMonth(), 1); // July
  this.currentMonth2 = new Date(now.getFullYear(), now.getMonth() + 1, 1); // August
    this.days1 = this.getMonthDays(this.currentMonth1); // e.g., July
  this.days2 = this.getMonthDays(this.currentMonth2); // e.g., August
  }

  generateTwoMonths() {
    this.months = [
      new Date(this.displayedDate.getFullYear(), this.displayedDate.getMonth(), 1),
      new Date(this.displayedDate.getFullYear(), this.displayedDate.getMonth() + 1, 1)
    ];
  }

  prev() {
    this.displayedDate = new Date(
      this.displayedDate.getFullYear(),
      this.displayedDate.getMonth() - 1,
      1
    );
    this.generateTwoMonths();
  }

  next() {
    this.displayedDate = new Date(
      this.displayedDate.getFullYear(),
      this.displayedDate.getMonth() + 1,
      1
    );
    this.generateTwoMonths();
  } */












  /* getMonthDays(month: Date): (Date | null)[] {
    const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
    const lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    const days: (Date | null)[] = [];

    for (let i = 0; i < firstDay.getDay(); i++) days.push(null);
    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push(new Date(month.getFullYear(), month.getMonth(), d));
    }
    return days;
  } */
//   getMonthDays(month: Date): (Date | null)[] {
//   const days: (Date | null)[] = [];
//   const year = month.getFullYear();
//   const monthIndex = month.getMonth();
//   const firstDay = new Date(year, monthIndex, 1);
//   const lastDay = new Date(year, monthIndex + 1, 0);
//   const startDay = firstDay.getDay(); // 0 (Sun) – 6 (Sat)

//   // Fill leading empty days
//   for (let i = 0; i < startDay; i++) {
//     days.push(null);
//   }

//   // Fill actual days
//   for (let i = 1; i <= lastDay.getDate(); i++) {
//     days.push(new Date(year, monthIndex, i));
//   }

//   // Fill trailing empty cells to complete 6 weeks (6x7 = 42)
//   while (days.length % 7 !== 0 || days.length < 42) {
//     days.push(null);
//   }

//   return days;
// }


/* ----------------------------------------------

getMonthDays(month: Date): (Date | null)[] {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const firstDay = new Date(year, monthIndex, 1);
  const lastDay = new Date(year, monthIndex + 1, 0);

  const days: (Date | null)[] = [];

  // Fill starting empty slots
  const startWeekDay = firstDay.getDay();
  for (let i = 0; i < startWeekDay; i++) {
    days.push(null);
  }

  // Fill actual days
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, monthIndex, i));
  }

  // Fill trailing empty slots to complete the week grid (6x7 = 42)
  while (days.length % 7 !== 0 || days.length < 42) {
    days.push(null);
  }

  return days;
}

  isSameDate(d1: Date | null, d2: Date | null): boolean {
    return !!d1 && !!d2 &&
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();
  }

  isInRange(day: Date | null): boolean {
    return !!day && !!this.checkInDate && !!this.checkOutDate &&
      day > this.checkInDate && day < this.checkOutDate;
  }

  isSelectable(day: Date | null): boolean {
    return !!day && day >= new Date(new Date().setHours(0, 0, 0, 0));
  }

  onDateClick(day: Date | null) {
    if (!day || !this.isSelectable(day)) return;

    if (!this.checkInDate || (this.checkInDate && this.checkOutDate)) {
      this.checkInDate = day;
      this.checkOutDate = null;
    } else if (this.checkInDate && day > this.checkInDate) {
      this.checkOutDate = day;
      this.calculatePrice();
    } else {
      this.checkInDate = day;
      this.checkOutDate = null;
    }
  }

  calculatePrice() {
    if (this.checkInDate && this.checkOutDate) {
      const diff = this.checkOutDate.getTime() - this.checkInDate.getTime();
      const nights = diff / (1000 * 60 * 60 * 24);
      this.totalPrice = nights * this.pricePerNight;
    }
  }
  getNights(): number {
  if (this.checkInDate && this.checkOutDate) {
    const diff = this.checkOutDate.getTime() - this.checkInDate.getTime();
    return diff / (1000 * 60 * 60 * 24);
  }
  return 0;
}
  }


 -------------------------------------------*/









/*   monthNames: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  weekDays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  currentDate: Date = new Date();
  displayedMonths: Date[] = [];

  checkInDate: Date | null = null;
  checkOutDate: Date | null = null;
  nightlyPrice: number = 100;

  constructor() {
    this.generateDisplayedMonths();
  }

  generateDisplayedMonths(): void {
    this.displayedMonths = [0, 1].map(offset => {
      const date = new Date(this.currentDate);
      date.setMonth(date.getMonth() + offset);
      return date;
    });
  }

  getMonthDays(month: Date): (Date | null)[] {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();

    const firstDay = new Date(year, monthIndex, 1);
    const lastDay = new Date(year, monthIndex + 1, 0);
    const days: (Date | null)[] = [];

    // Add empty cells for first week day
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    // Add actual days
    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push(new Date(year, monthIndex, d));
    }

    return days;
  }

  isSameDate(d1: Date | null, d2: Date | null): boolean {
    return !!(d1 && d2 && d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate());
  }

  isBetween(d: Date): boolean {
    return this.checkInDate && this.checkOutDate && d > this.checkInDate && d < this.checkOutDate;
  }

  isSelectable(day: Date | null): boolean {
    return !!day && (!this.checkInDate || !this.checkOutDate || day >= this.checkInDate && day <= this.checkOutDate);
  }

  onDateClick(date: Date): void {
    if (!this.checkInDate || (this.checkInDate && this.checkOutDate)) {
      this.checkInDate = date;
      this.checkOutDate = null;
    } else if (date > this.checkInDate) {
      this.checkOutDate = date;
    } else {
      this.checkInDate = date;
      this.checkOutDate = null;
    }
  }

  get numberOfNights(): number {
    if (!this.checkInDate || !this.checkOutDate) return 0;
    const diff = this.checkOutDate.getTime() - this.checkInDate.getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
  }

  get totalPrice(): number {
    return this.numberOfNights * this.nightlyPrice;
  } */
//}
