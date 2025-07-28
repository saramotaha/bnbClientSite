export interface BookingCreateDto {
  propertyId: number;
  startDate: Date;
  endDate: Date;
  totalGuests: number;
  promotionId?: number;
}

export interface BookingUpdateDto {
  startDate: Date;
  endDate: Date;
  totalGuests: number;
  promotionId?: number;
}

export interface BookingStatusUpdateDto {
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'denied'; // adjust based on your BookingStatus enum
}

export interface BookingCheckInStatusUpdate {
  checkInStatus: string; // usually "completed"
}

export interface BookingCheckOutStatusUpdate {
  checkOutStatus: string; // usually "completed"
}

export interface BookingSearchDto {
  status?: string;
  fromDate?: Date;
  toDate?: Date;
  guestId?: number;
  propertyId?: number;
}

export interface BookingStatsDto {
  totalBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  pendingBookings: number;
  completedBookings: number;
  deniedBookings: number;
}

export interface BookingResponseDto {
  id: number;
  propertyTitle: string;
  propertyAddress: string;
  startDate: Date;
  endDate: Date;
  guestName: string;
  totalGuests: number;
  status: string;
  checkInStatus: string;
  checkOutStatus: string;
  totalAmount: number;
  promotionId?: number;
  createdAt: Date;
}

export interface BookingPayoutResponseDto {
  id: number;
  amount: number;
  status: string;
  createdAt: Date;
  bookingId: number;
  propertyTitle: string;
  guestFullName: string;
  hostFullName: string;
}

export interface BookingPaymentDto {
  id: number;
  bookingId: number;
  amount: number;
  status: string;
  transactionId: string;
  createdAt: Date;
  propertyTitle: string;
}
export interface MonthlyEarning {
  month: string;
  amount: number;
  isCurrentMonth: boolean;
}
