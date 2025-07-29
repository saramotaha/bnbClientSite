import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-calendar-modal-component',
  imports: [CommonModule ],
    standalone: true, // ✅ This is required

  templateUrl: './calendar-modal-component.html',
  styleUrl: './calendar-modal-component.css'
})
export class CalendarModalComponent {
   today: Date = new Date();
  currentMonthDate: Date = new Date(); // first month
  nextMonthDate: Date = new Date(); // second month

  days1: (Date | null)[][] = []; // first month weeks
  days2: (Date | null)[][] = []; // second month weeks
  dayNames: string[] = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  startDate: Date | null = null;
  endDate: Date | null = null;

  ngOnInit(): void {
    this.nextMonthDate.setMonth(this.currentMonthDate.getMonth() + 1);
    this.generateCalendars();
  }

  generateCalendars() {
    this.days1 = this.generateMonth(this.currentMonthDate);
    this.days2 = this.generateMonth(this.nextMonthDate);
  }

  generateMonth(date: Date): (Date | null)[][] {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const calendar: (Date | null)[][] = [];

    let week: (Date | null)[] = [];
    const startDay = firstDayOfMonth.getDay();

    // Fill leading empty days
    for (let i = 0; i < startDay; i++) {
      week.push(null);
    }

    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      week.push(new Date(year, month, day));
      if (week.length === 7) {
        calendar.push(week);
        week = [];
      }
    }

    // Fill trailing empty days
    if (week.length > 0) {
      while (week.length < 7) {
        week.push(null);
      }
      calendar.push(week);
    }

    return calendar;
  }

  isSameDate(d1: Date, d2: Date): boolean {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  }

  isStartDate(date: Date | null): boolean {
    return !!this.startDate && !!date && this.isSameDate(this.startDate, date);
  }

  isEndDate(date: Date | null): boolean {
    return !!this.endDate && !!date && this.isSameDate(this.endDate, date);
  }

  isInRange(date: Date | null): boolean {
    if (!date || !this.startDate || !this.endDate) return false;
    return date > this.startDate && date < this.endDate;
  }

  selectDate(date: Date | null): void {
    if (!date) return;

    if (!this.startDate || (this.startDate && this.endDate)) {
      this.startDate = date;
      this.endDate = null;
    } else if (this.startDate && !this.endDate) {
      if (date < this.startDate) {
        this.endDate = this.startDate;
        this.startDate = date;
      } else if (this.isSameDate(this.startDate, date)) {
        this.startDate = date;
        this.endDate = null;
      } else {
        this.endDate = date;
      }
    }
  }

  getNightCount(): number {
    if (this.startDate && this.endDate) {
      const diff = Math.abs(this.endDate.getTime() - this.startDate.getTime());
      return Math.ceil(diff / (1000 * 60 * 60 * 24));
    }
    return 0;
  }

  clearStartDate(): void {
    this.startDate = null;
    if (this.endDate) {
      this.endDate = null;
    }
  }

  clearEndDate(): void {
    this.endDate = null;
  }

  clearDates(): void {
    this.startDate = null;
    this.endDate = null;
  }

  openCalendar(): void {
    // No-op or optional: this can open a modal if used outside
  }

  closeModal(): void {
    // You can emit an event to parent component or set `isOpen = false`
  }

  getMonthTitle(index: number): string {
    const date = new Date();
    date.setMonth(this.currentMonthDate.getMonth() + index);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  }

  prevMonth(): void {
    this.currentMonthDate.setMonth(this.currentMonthDate.getMonth() - 1);
    this.nextMonthDate.setMonth(this.currentMonthDate.getMonth() + 1);
    this.generateCalendars();
  }

  nextMonth(): void {
    this.currentMonthDate.setMonth(this.currentMonthDate.getMonth() + 1);
    this.nextMonthDate.setMonth(this.currentMonthDate.getMonth() + 1);
    this.generateCalendars();
  }
}
