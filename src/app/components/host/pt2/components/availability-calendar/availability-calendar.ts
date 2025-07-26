import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CalendarData } from '../../models/calendar-data.model';

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
    basePrice: 88,
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

  monthOptions = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  yearOptions: number[] = [];

  selectedDate: Date | null = null;
  calendarDates: DateAvailability[] = [];
  isLoading: boolean = false;

  weekDays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  ngOnInit() {
    // Generate year options (current year - 1 to current year + 3)
    const currentYear = new Date().getFullYear();
    this.yearOptions = Array.from({length: 5}, (_, i) => currentYear - 1 + i);
    
    this.currentMonth = new Date(this.initialMonth);
    this.selectedMonthIndex = this.currentMonth.getMonth();
    this.selectedYear = this.currentMonth.getFullYear();
    
    // Generate initial mock data for better demo experience
    this.generateMockDataForCurrentMonth();
    this.generateCalendar();
    this.requestDataForMonth();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['calendarData'] || changes['priceSettings']) {
      this.generateCalendar();
    }
  }

  generateMockDataForCurrentMonth() {
    // Generate mock data for the entire current month to ensure calendar always shows data
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = this.formatDateString(date);
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const isPast = this.isPastDate(date);
      
     if (!this.calendarData[dateString]) {
  const randomlyBlocked = Math.random() < 0.1 && !isPast;
  
  this.calendarData[dateString] = {
    date: new Date(dateString),
    price: isWeekend ? this.priceSettings.weekendPrice : this.priceSettings.basePrice,
    available: !isPast && !randomlyBlocked,
    blocked: randomlyBlocked,
    minStay: 1,
    maxStay: 365,
    isWeekend: isWeekend,
    isEditing: false
  };
}

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

    // Add empty cells for previous month days
    for (let i = 0; i < startingDayOfWeek; i++) {
      const emptyDate = new Date(year, month, -(startingDayOfWeek - i - 1));
      this.calendarDates.push({ 
        date: emptyDate, 
        price: 0, 
        available: false,
        isEditing: false 
      });
    }

    // Add current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = this.formatDateString(date);
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const isPast = this.isPastDate(date);
      const dayData = this.calendarData[dateString];
      
      // Use existing data or generate default values
      const defaultPrice = isWeekend ? this.priceSettings.weekendPrice : this.priceSettings.basePrice;
      const available = dayData?.available ?? (!isPast);
      const blocked = dayData?.blocked ?? false;

      this.calendarDates.push({
        date: date,
        price: dayData?.price ?? defaultPrice,
        available: available && !isPast,
        blocked: blocked,
        isWeekend: isWeekend,
        minStay: dayData?.minStay ?? this.availabilitySettings.minStay,
        maxStay: dayData?.maxStay ?? this.availabilitySettings.maxStay,
        isEditing: false
      });
    }

    // Add next month days to fill the grid (optional for Airbnb-like experience)
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
  }

  formatDateString(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  previousMonth() {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1, 1);
    this.selectedMonthIndex = this.currentMonth.getMonth();
    this.selectedYear = this.currentMonth.getFullYear();
    this.generateMockDataForCurrentMonth();
    this.generateCalendar();
    this.monthChanged.emit({ year: this.currentMonth.getFullYear(), month: this.currentMonth.getMonth() + 1 });
    this.requestDataForMonth();
  }

  nextMonth() {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1);
    this.selectedMonthIndex = this.currentMonth.getMonth();
    this.selectedYear = this.currentMonth.getFullYear();
    this.generateMockDataForCurrentMonth();
    this.generateCalendar();
    this.monthChanged.emit({ year: this.currentMonth.getFullYear(), month: this.currentMonth.getMonth() + 1 });
    this.requestDataForMonth();
  }

  onMonthYearChange() {
    this.currentMonth = new Date(this.selectedYear, this.selectedMonthIndex, 1);
    
    // // Generate mock data for the new month to ensure calendar always shows
    // this.generateMockDataForCurrentMonth();
    // this.generateCalendar();
    // this.monthChanged.emit({ year: this.selectedYear, month: this.selectedMonthIndex + 1 });

    // Request real data
    this.dataLoadRequested.emit({
      year: this.selectedYear,
      month: this.selectedMonthIndex + 1
    });
  }

  requestDataForMonth() {
    this.dataLoadRequested.emit({
      year: this.currentMonth.getFullYear(),
      month: this.currentMonth.getMonth() + 1
    });
  }

  selectDate(dateAvailability: DateAvailability) {
    if (!this.readonly && 
        dateAvailability.available && 
        this.isCurrentMonth(dateAvailability.date) && 
        !dateAvailability.blocked &&
        !this.isPastDate(dateAvailability.date)) {
      this.selectedDate = dateAvailability.date;
      this.dateSelected.emit(dateAvailability.date);
    }
  }

  toggleDateAvailability(dateAvailability: DateAvailability, event: Event) {
    event.stopPropagation();
    if (this.readonly || 
        !this.isCurrentMonth(dateAvailability.date) || 
        this.isPastDate(dateAvailability.date)) return;
        
    dateAvailability.available = !dateAvailability.available;

    const dateString = this.formatDateString(dateAvailability.date);
    if (!this.calendarData[dateString]) {
      this.calendarData[dateString] = {
        date: dateAvailability.date,
        price: dateAvailability.price,
        available: dateAvailability.available,
        blocked: dateAvailability.blocked,
        minStay: dateAvailability.minStay,
        maxStay: dateAvailability.maxStay,
        isWeekend: dateAvailability.isWeekend,
        isEditing: dateAvailability.isEditing
      };
    }
    this.calendarData[dateString].available = dateAvailability.available;

    this.dateAvailabilityChanged.emit({ date: dateAvailability.date, availability: dateAvailability });
  }

  toggleEditing(dateAvailability: DateAvailability, event?: Event): void {
    if (event) event.stopPropagation();
    if (!this.isCurrentMonth(dateAvailability.date) || 
        this.readonly || 
        dateAvailability.blocked ||
        this.isPastDate(dateAvailability.date)) return;

    // Close any other editing states
    this.calendarDates.forEach(date => {
      if (date !== dateAvailability) {
        date.isEditing = false;
      }
    });

    dateAvailability.isEditing = !dateAvailability.isEditing;
  }

  updateDatePrice(dateAvailability: DateAvailability, newPrice: number): void {
    if (this.readonly || 
        !this.isCurrentMonth(dateAvailability.date) ||
        this.isPastDate(dateAvailability.date)) return;
        
    // Validate price
    if (isNaN(newPrice) || newPrice < 0) {
      newPrice = dateAvailability.isWeekend ? this.priceSettings.weekendPrice : this.priceSettings.basePrice;
    }

    dateAvailability.price = Math.max(0, Math.round(newPrice));
    dateAvailability.isEditing = false;

    const dateString = this.formatDateString(dateAvailability.date);
    if (!this.calendarData[dateString]){
      this.calendarData[dateString] = {
        date: dateAvailability.date,
        price: dateAvailability.price,
        available: dateAvailability.available,
        blocked: dateAvailability.blocked,
        minStay: dateAvailability.minStay,
        maxStay: dateAvailability.maxStay,
        isWeekend: dateAvailability.isWeekend,
        isEditing: dateAvailability.isEditing
        };
    }
    this.calendarData[dateString].price = dateAvailability.price;

    this.dateAvailabilityChanged.emit({ date: dateAvailability.date, availability: dateAvailability });
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

  setAllDatesAvailable(available: boolean) {
    if (this.readonly) return;
    this.calendarDates.forEach(dateAvailability => {
      if (this.isCurrentMonth(dateAvailability.date) && 
          !this.isPastDate(dateAvailability.date) &&
          !dateAvailability.blocked) {
        dateAvailability.available = available;
        const dateString = this.formatDateString(dateAvailability.date);
        if (!this.calendarData[dateString]){
              this.calendarData[dateString] = {
                date: dateAvailability.date,
                price: dateAvailability.price,
                available: dateAvailability.available,
                blocked: dateAvailability.blocked,
                minStay: dateAvailability.minStay,
                maxStay: dateAvailability.maxStay,
                isWeekend: dateAvailability.isWeekend,
                isEditing: dateAvailability.isEditing
                };
        }
        this.calendarData[dateString].available = available;
      }
    });
    this.emitBulkChange();
  }

  setWeekendPricing(weekendPrice: number) {
    if (this.readonly) return;
    this.priceSettings.weekendPrice = Math.max(0, Math.round(weekendPrice));

    this.calendarDates.forEach(dateAvailability => {
      if (this.isCurrentMonth(dateAvailability.date) && 
          dateAvailability.isWeekend &&
          !this.isPastDate(dateAvailability.date)) {
        dateAvailability.price = this.priceSettings.weekendPrice;
        const dateString = this.formatDateString(dateAvailability.date);
          if (!this.calendarData[dateString]){
          this.calendarData[dateString] = {
            date: dateAvailability.date,
            price: dateAvailability.price,
            available: dateAvailability.available,
            blocked: dateAvailability.blocked,
            minStay: dateAvailability.minStay,
            maxStay: dateAvailability.maxStay,
            isWeekend: dateAvailability.isWeekend,
            isEditing: dateAvailability.isEditing
            };
        }
        this.calendarData[dateString].price = this.priceSettings.weekendPrice;
      }
    });

    this.priceSettingsChange.emit(this.priceSettings);
    this.emitBulkChange();
  }

  setWeekdayPricing(weekdayPrice: number) {
    if (this.readonly) return;
    this.priceSettings.basePrice = Math.max(0, Math.round(weekdayPrice));

    this.calendarDates.forEach(dateAvailability => {
      if (this.isCurrentMonth(dateAvailability.date) && 
          !dateAvailability.isWeekend &&
          !this.isPastDate(dateAvailability.date)) {
        dateAvailability.price = this.priceSettings.basePrice;

        const dateString = this.formatDateString(dateAvailability.date);
          if (!this.calendarData[dateString]){
          this.calendarData[dateString] = {
            date: dateAvailability.date,
            price: dateAvailability.price,
            available: dateAvailability.available,
            blocked: dateAvailability.blocked,
            minStay: dateAvailability.minStay,
            maxStay: dateAvailability.maxStay,
            isWeekend: dateAvailability.isWeekend,
            isEditing: dateAvailability.isEditing
            };
        }
        this.calendarData[dateString].price = this.priceSettings.basePrice;
      }
    });

    this.priceSettingsChange.emit(this.priceSettings);
    this.emitBulkChange();
  }

  private emitBulkChange() {
    // Emit a signal that bulk changes occurred
    this.dateAvailabilityChanged.emit({
      date: new Date(),
      availability: {
        date: new Date(),
        price: 0,
        available: true
      }
    });
  }

  setLoading(loading: boolean) {
    this.isLoading = loading;
  }

  updateCalendarData(newData: CalendarData) {
    this.calendarData = { ...this.calendarData, ...newData };
    this.generateCalendar();
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

  // Additional utility methods for better Airbnb-like experience
  
  /**
   * Get availability stats for current month
   */
  getMonthStats() {
    const currentMonthDates = this.calendarDates.filter(d => this.isCurrentMonth(d.date));
    const available = currentMonthDates.filter(d => d.available && !this.isPastDate(d.date)).length;
    const blocked = currentMonthDates.filter(d => d.blocked).length;
    const total = currentMonthDates.length;
    
    return { available, blocked, total, unavailable: total - available - blocked };
  }

  /**
   * Clear selection when clicking outside
   */
  clearSelection() {
    this.selectedDate = null;
    // Close any editing states
    this.calendarDates.forEach(date => date.isEditing = false);
  }

  /**
   * Navigate to today's month
   */
  goToToday() {
    const today = new Date();
    this.currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    this.selectedMonthIndex = this.currentMonth.getMonth();
    this.selectedYear = this.currentMonth.getFullYear();
    this.generateMockDataForCurrentMonth();
    this.generateCalendar();
    this.monthChanged.emit({ year: this.currentMonth.getFullYear(), month: this.currentMonth.getMonth() + 1 });
  }
}