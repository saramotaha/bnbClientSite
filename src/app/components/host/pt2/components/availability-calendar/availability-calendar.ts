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
  price: number;
  available: boolean;
  isWeekend?: boolean;
  blocked?: boolean;
  minStay?: number;
  maxStay?: number;
  isEditing?: boolean;
}

interface PriceSettings {
  basePrice: number;
  weekendPrice: number;
  weeklyDiscount: number;
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
  @Input() priceSettings: PriceSettings = {
    basePrice: 50,
    weekendPrice: 95,
    weeklyDiscount: 10
  };

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
  @Output() priceSettingsChange = new EventEmitter<PriceSettings>();
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

    // Load data before generating calendar
    await this.requestDataForMonth();
    this.generateCalendar();
    this.cdr.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['calendarData'] || changes['priceSettings']) {
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
        price: 0,
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
      
      // Use persisted data if available, otherwise create default
      const persistedData = this.calendarData[dateString];
      this.calendarDates.push({
        date,
        price: persistedData?.price ?? 
              (isWeekend ? this.priceSettings.weekendPrice : this.priceSettings.basePrice),
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
        price: 0,
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
  // Clear blocked status when making available
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

toggleEditing(dateAvailability: DateAvailability, event?: Event): void {
  if (event) event.stopPropagation();
  if (!this.isCurrentMonth(dateAvailability.date) || 
      this.readonly || 
      dateAvailability.blocked ||
      this.isPastDate(dateAvailability.date)) return;

  this.calendarDates.forEach(date => {
    if (date !== dateAvailability) date.isEditing = false;
  });

  dateAvailability.isEditing = !dateAvailability.isEditing;
  this.cdr.detectChanges();
}

updateDatePrice(dateAvailability: DateAvailability, newPrice: number): void {
  if (this.readonly || 
      !this.isCurrentMonth(dateAvailability.date) ||
      this.isPastDate(dateAvailability.date)) return;

  if (isNaN(newPrice) || newPrice < 0) {
    newPrice = dateAvailability.isWeekend ? this.priceSettings.weekendPrice : this.priceSettings.basePrice;
  }

  dateAvailability.price = Math.max(0, Math.round(newPrice));
  dateAvailability.isEditing = false;

  const dateString = this.formatDateString(dateAvailability.date);
  if (!this.calendarData[dateString]) {
    this.calendarData[dateString] = { ...dateAvailability };
  } else {
    this.calendarData[dateString].price = dateAvailability.price;
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

setWeekdayPricing(price: number) {
  if (this.readonly || !price || price <= 0) return;
  
  // Update price settings FIRST
  this.priceSettings = {
    ...this.priceSettings,
    basePrice: Math.max(0, Math.round(price))
  };
  this.priceSettingsChange.emit(this.priceSettings);
  
  const updates: CreateAvailabilityDTO[] = [];
  
  this.calendarDates.forEach(dateAvailability => {
    if (this.isCurrentMonth(dateAvailability.date) &&
        !dateAvailability.isWeekend &&
        !this.isPastDate(dateAvailability.date)) {
      
      dateAvailability.price = this.priceSettings.basePrice;
      const dateStr = this.formatDateString(dateAvailability.date);
      
      updates.push({
        propertyId: Number(this.propertyId),
        date: dateStr,
        isAvailable: dateAvailability.available,
        blockedReason: dateAvailability.available ? "" : 'manual block',
        price: dateAvailability.price,
        minNights: dateAvailability.minStay ?? 1
      });
      
      if (!this.calendarData[dateStr]) {
        this.calendarData[dateStr] = { ...dateAvailability };
      } else {
        this.calendarData[dateStr].price = dateAvailability.price;
      }
    }
  });

  this.bulkUpdateAvailability(updates);
  this.cdr.detectChanges();
}

setWeekendPricing(price: number) {
  if (this.readonly || !price || price <= 0) return;
  
  // Update price settings FIRST
  this.priceSettings = {
    ...this.priceSettings,
    weekendPrice: Math.max(0, Math.round(price))
  };
  this.priceSettingsChange.emit(this.priceSettings);
  
  const updates: CreateAvailabilityDTO[] = [];
  
  this.calendarDates.forEach(dateAvailability => {
    if (this.isCurrentMonth(dateAvailability.date) &&
        dateAvailability.isWeekend &&
        !this.isPastDate(dateAvailability.date)) {
      
      dateAvailability.price = this.priceSettings.weekendPrice;
      const dateStr = this.formatDateString(dateAvailability.date);
      
      updates.push({
        propertyId: Number(this.propertyId),
        date: dateStr,
        isAvailable: dateAvailability.available,
        blockedReason: dateAvailability.available ? "" : 'manual block',
        price: dateAvailability.price,
        minNights: dateAvailability.minStay ?? 1
      });
      
      if (!this.calendarData[dateStr]) {
        this.calendarData[dateStr] = { ...dateAvailability };
      } else {
        this.calendarData[dateStr].price = dateAvailability.price;
      }
    }
  });

  this.bulkUpdateAvailability(updates);
  this.cdr.detectChanges();
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
        price: dateAvailability.price,
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
        price: dto.price,
        available: dto.isAvailable,
        blocked: !dto.isAvailable,
        minStay: dto.minNights
      }
    });
  });
}

emitBulkChange() {
  this.dateAvailabilityChanged.emit({
    date: new Date(),
    availability: {
      date: new Date(),
      price: 0,
      available: true
    }
  });
}

onPriceSettingsChange() {
  this.priceSettingsChange.emit(this.priceSettings);
  this.generateCalendar();
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