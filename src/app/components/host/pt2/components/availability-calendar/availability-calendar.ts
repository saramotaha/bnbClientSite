import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CalendarData } from '../../models/calendar-data.model';
import { CreateAvailabilityDTO } from '../../models/availability.model';

interface DateAvailability {
  date: Date;
  available: boolean;
  isWeekend?: boolean;
  blocked?: boolean;
  minStay?: number;
  maxStay?: number;
  isEditing?: boolean;
}

interface AvailabilitySettings {
  minStay: number;
  maxStay: number;
  advanceNotice: string;
}

@Component({
  selector: 'app-availability-calendar',
  templateUrl: './availability-calendar.html',
  styleUrls: ['./availability-calendar.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class AvailabilityCalendarComponent implements OnInit, OnChanges {
  @Input() basePrice: number = 50;

  @Input() availabilitySettings: AvailabilitySettings = {
    minStay: 1,
    maxStay: 365,
    advanceNotice: 'Same day advance notice'
  };

  @Input() calendarData: CalendarData = {};
  @Input() propertyId: string = '';
  @Input() initialMonth: Date = new Date();
  @Input() readonly: boolean = false;

  @Output() dateSelected = new EventEmitter<Date>();
  @Output() dateAvailabilityChanged = new EventEmitter<{ date: Date, availability: DateAvailability }>();
  @Output() basePriceChange = new EventEmitter<number>();
  @Output() availabilitySettingsChange = new EventEmitter<AvailabilitySettings>();
  @Output() monthChanged = new EventEmitter<{ year: number, month: number }>();
  @Output() dataLoadRequested = new EventEmitter<{ year: number, month: number }>();

  currentMonth: Date = new Date();
  selectedMonthIndex: number = new Date().getMonth();
  selectedYear: number = new Date().getFullYear();

  monthOptions = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];
  yearOptions: number[] = [];

  selectedDate: Date | null = null;
  calendarDates: DateAvailability[] = [];
  isLoading: boolean = false;

  weekDays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  constructor(private cdr: ChangeDetectorRef) {}

  async ngOnInit() {
    const currentYear = new Date().getFullYear();
    this.yearOptions = Array.from({length: 5}, (_, i) => currentYear + i);

    this.currentMonth = new Date(this.initialMonth);
    this.selectedMonthIndex = this.currentMonth.getMonth();
    this.selectedYear = this.currentMonth.getFullYear();

    await this.requestDataForMonth();
    this.generateCalendar();
    this.cdr.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['calendarData'] || changes['basePrice']) {
      this.generateCalendar();
      this.cdr.detectChanges();
    }
  }

  generateCalendar() {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    this.calendarDates = [];

    // Add empty cells from previous month
    for (let i = 0; i < startingDayOfWeek; i++) {
      const emptyDate = new Date(year, month, -(startingDayOfWeek - i - 1));
      this.calendarDates.push({
        date: emptyDate,
        available: false,
        isEditing: false
      });
    }

    // Add current month days with persisted data
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = this.formatDateString(date);
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const isPast = this.isPastDate(date);
      
      const persistedData = this.calendarData[dateString];
      this.calendarDates.push({
        date,
        available: persistedData?.available ?? !isPast,
        blocked: persistedData?.blocked ?? false,
        isWeekend,
        minStay: persistedData?.minStay ?? this.availabilitySettings.minStay,
        maxStay: persistedData?.maxStay ?? this.availabilitySettings.maxStay,
        isEditing: false
      });
    }

    // Pad next month
    const totalCells = this.calendarDates.length;
    const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);

    for (let i = 1; i <= remainingCells; i++) {
      const nextMonthDate = new Date(year, month + 1, i);
      this.calendarDates.push({
        date: nextMonthDate,
        available: false,
        isEditing: false
      });
    }
    
    this.cdr.detectChanges();
  }

  updateCalendarData(newData: CalendarData) {
    this.calendarData = { ...this.calendarData, ...newData };
    this.generateCalendar();
    this.cdr.detectChanges();
  }

  formatDateString(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  previousMonth() {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1, 1);
    this.selectedMonthIndex = this.currentMonth.getMonth();
    this.selectedYear = this.currentMonth.getFullYear();
    this.requestDataForMonth();
    this.cdr.detectChanges();
  }

  nextMonth() {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1);
    this.selectedMonthIndex = this.currentMonth.getMonth();
    this.selectedYear = this.currentMonth.getFullYear();
    this.requestDataForMonth();
    this.cdr.detectChanges();
  }

  onMonthYearChange() {
    this.currentMonth = new Date(this.selectedYear, this.selectedMonthIndex, 1);
    this.dataLoadRequested.emit({
      year: this.selectedYear,
      month: this.selectedMonthIndex + 1
    });
    this.cdr.detectChanges();
  }

  requestDataForMonth() {
    this.dataLoadRequested.emit({
      year: this.currentMonth.getFullYear(),
      month: this.currentMonth.getMonth() + 1
    });
  }

  setLoading(loading: boolean) {
    this.isLoading = loading;
    this.cdr.detectChanges();
  }

  selectDate(dateAvailability: DateAvailability) {
    if (!this.readonly && 
        dateAvailability.available && 
        this.isCurrentMonth(dateAvailability.date) && 
        !dateAvailability.blocked &&
        !this.isPastDate(dateAvailability.date)) {
      this.selectedDate = dateAvailability.date;
      this.dateSelected.emit(dateAvailability.date);
      this.cdr.detectChanges();
    }
  }

  toggleDateAvailability(dateAvailability: DateAvailability, event: Event) {
    event.stopPropagation();
    if (this.readonly || 
        !this.isCurrentMonth(dateAvailability.date) || 
        this.isPastDate(dateAvailability.date)) return;

    dateAvailability.available = !dateAvailability.available;
    if (dateAvailability.available) {
      dateAvailability.blocked = false;
    } else {
      dateAvailability.blocked = true;
    }
    
    const dateString = this.formatDateString(dateAvailability.date);
    
    if (!this.calendarData[dateString]) {
      this.calendarData[dateString] = { ...dateAvailability };
    } else {
      this.calendarData[dateString].available = dateAvailability.available;
      this.calendarData[dateString].blocked = dateAvailability.blocked;
    }

    this.dateAvailabilityChanged.emit({ 
      date: dateAvailability.date, 
      availability: dateAvailability 
    });
    this.cdr.detectChanges();
  }

  isCurrentMonth(date: Date): boolean {
    return date.getMonth() === this.currentMonth.getMonth() &&
           date.getFullYear() === this.currentMonth.getFullYear();
  }

  isSelected(date: Date) {
    return this.selectedDate &&
           date.getDate() === this.selectedDate.getDate() &&
           date.getMonth() === this.selectedDate.getMonth() &&
           date.getFullYear() === this.selectedDate.getFullYear();
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }

  isPastDate(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    return compareDate < today;
  }

  getCurrentMonthName(): string {
    return this.monthOptions[this.currentMonth.getMonth()];
  }

  getCurrentYear(): number {
    return this.currentMonth.getFullYear();
  }

  getMonthDateRange(): { start: Date, end: Date } {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();

    return {
      start: new Date(year, month, 1),
      end: new Date(year, month + 1, 0)
    };
  }

  exportCalendarData(): CalendarData {
    return { ...this.calendarData };
  }

  setAllDatesAvailable(available: boolean) {
    if (this.readonly) return;
    
    const updates: CreateAvailabilityDTO[] = [];
    
    this.calendarDates.forEach(dateAvailability => {
      if (this.isCurrentMonth(dateAvailability.date) && 
          !this.isPastDate(dateAvailability.date)) {
        
        dateAvailability.available = available;
        dateAvailability.blocked = !available;
        const dateStr = this.formatDateString(dateAvailability.date);
        
        updates.push({
          propertyId: Number(this.propertyId),
          date: dateStr,
          isAvailable: available,
          blockedReason: available ? "" : 'manual block',
          price: this.basePrice,
          minNights: dateAvailability.minStay ?? 1
        });
        
        if (!this.calendarData[dateStr]) {
          this.calendarData[dateStr] = { ...dateAvailability };
        } else {
          this.calendarData[dateStr].available = available;
          this.calendarData[dateStr].blocked = !available;
        }
      }
    });

    this.bulkUpdateAvailability(updates);
    this.cdr.detectChanges();
  }

  private bulkUpdateAvailability(updates: CreateAvailabilityDTO[]) {
    updates.forEach(dto => {
      this.dateAvailabilityChanged.emit({ 
        date: new Date(dto.date), 
        availability: {
          date: new Date(dto.date),
          available: dto.isAvailable,
          blocked: !dto.isAvailable,
          minStay: dto.minNights
        }
      });
    });
  }

  onBasePriceChange(newPrice: number) {
    this.basePrice = Math.max(0, Math.round(newPrice));
    this.basePriceChange.emit(this.basePrice);
  }

  onAvailabilitySettingsChange() {
    this.availabilitySettingsChange.emit(this.availabilitySettings);
  }

  getInputValue(event: Event): number {
    const target = event.target as HTMLInputElement;
    return Number(target.value);
  }

  getMonthStats() {
    const currentMonthDates = this.calendarDates.filter(d => this.isCurrentMonth(d.date));
    const available = currentMonthDates.filter(d => d.available && !this.isPastDate(d.date)).length;
    const blocked = currentMonthDates.filter(d => d.blocked).length;
    const total = currentMonthDates.length;
    
    return {
      available,
      blocked,
      total,
      unavailable: total - available - blocked
    };
  }

  clearSelection() {
    this.selectedDate = null;
    this.calendarDates.forEach(date => date.isEditing = false);
    this.cdr.detectChanges();
  }

  goToToday() {
    const today = new Date();
    this.currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    this.selectedMonthIndex = this.currentMonth.getMonth();
    this.selectedYear = this.currentMonth.getFullYear();
    this.requestDataForMonth();
    this.cdr.detectChanges();
  }
}