export interface DateAvailability {
  date: Date;
  price: number;
  available: boolean;
  blocked?: boolean; 
  minStay?: number;
  maxStay?: number;
  isWeekend?: boolean;
  isEditing?: boolean;
}

export interface CalendarData {
  [dateString: string]: DateAvailability;
}
