import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FilterHomesServices } from '../../Core/Services/filter-homes-services';
import { Router } from '@angular/router';
import { routes } from '../../app.routes';

@Component({
  selector: 'app-nav',
  imports: [CommonModule , FormsModule],
  templateUrl: './nav.html',
  styleUrl: './nav.css'
})
export class Nav {
  showCheckInCalendar = false;
  showCheckOutCalendar = false;
  showGuestsDropdown = false;
  showUserMenu = false;

  searchQuery = '';
  checkInDate: Date | null = null;
  checkOutDate: Date | null = null;
  guests = {
    adults: 1,
    children: 0,
    infants: 0
  };

  currentMonth = new Date();
  checkInCalendarDays: any[] = [];
  checkOutCalendarDays: any[] = [];

  constructor(private elementRef: ElementRef , private service : FilterHomesServices  , private router:Router) {
    this.generateCalendar();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: any) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.showCheckInCalendar = false;
      this.showCheckOutCalendar = false;
      this.showGuestsDropdown = false;
      this.showUserMenu = false;
    }
  }

  generateCalendar() {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    this.checkInCalendarDays = [];
    this.checkOutCalendarDays = [];

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      const dayInfo = {
        date: date,
        day: date.getDate(),
        isCurrentMonth: date.getMonth() === month,
        isToday: this.isToday(date),
        isSelected: false,
        isPast: date < new Date(new Date().setHours(0, 0, 0, 0))
      };

      this.checkInCalendarDays.push({ ...dayInfo });
      this.checkOutCalendarDays.push({ ...dayInfo });
    }
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  onCheckInHover() {
    this.showCheckInCalendar = true;
    this.showCheckOutCalendar = false;
    this.showGuestsDropdown = false;
  }

  onCheckOutHover() {
    this.showCheckOutCalendar = true;
    this.showCheckInCalendar = false;
    this.showGuestsDropdown = false;
  }

  onGuestsClick() {
    this.showGuestsDropdown = !this.showGuestsDropdown;
    this.showCheckInCalendar = false;
    this.showCheckOutCalendar = false;
  }

  onUserMenuClick() {
    this.showUserMenu = !this.showUserMenu;
  }

  selectCheckInDate(day: any) {
    if (day.isPast) return;
    this.checkInDate = day.date;
    this.showCheckInCalendar = false;
  }

  selectCheckOutDate(day: any) {
    if (day.isPast) return;
    this.checkOutDate = day.date;
    this.showCheckOutCalendar = false;
  }

  previousMonth() {
    this.currentMonth.setMonth(this.currentMonth.getMonth() - 1);
    this.generateCalendar();
  }

  nextMonth() {
    this.currentMonth.setMonth(this.currentMonth.getMonth() + 1);
    this.generateCalendar();
  }

  adjustGuests(type: string, operation: string) {
    if (operation === 'increment') {
      this.guests[type as keyof typeof this.guests]++;
    } else if (operation === 'decrement' && this.guests[type as keyof typeof this.guests] > 0) {
      if (type === 'adults' && this.guests.adults === 1) return;
      this.guests[type as keyof typeof this.guests]--;
    }
  }

  getTotalGuests(): number {
    return this.guests.adults + this.guests.children;
  }

  formatDate(date: Date | null): string {
    if (!date) return '';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  getMonthYear(): string {
    return this.currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }




  onSearch() {



    this.service.setFilters({
      location: this.searchQuery,
    startDate: this.checkInDate,
    endDate: this.checkOutDate,
    guests: this.getTotalGuests()

    })

    this.router.navigate(['/ViewAllHomes']);


  };

  }

