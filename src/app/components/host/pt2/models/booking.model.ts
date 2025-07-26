export interface BookingCreateDto {
  propertyId: number;
  startDate: string;
  endDate: string;
  totalGuests: number;
  promotionId?: number | null
  ;
}

export interface BookingResponseDto {
  id: number;
  propertyTitle: string;
  propertyAddress: string;
  startDate: string;
  endDate: string;
  guestName: string;
  totalGuests: number;
  status: string;
  checkInStatus: string;
  checkOutStatus: string;
  totalAmount: number;
  promotionId?: number;
  createdAt: string;
}

export interface BookingPaymentDto {
  id: number;
  bookingId: number;
  amount: number;
  status: string;
  transactionId: string;
  createdAt: string;
  propertyTitle: string;
}

export interface BookingSearchDto {
  status: string;
  fromDate?: string;
  toDate?: string;
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

export interface BookingStatusUpdateDto {
  status: string;
}

export interface BookingUpdateDto {
  startDate: string;
  endDate: string;
  totalGuests: number;
  promotionId?: number;
}

export interface BookingCheckInStatusUpdate {
  checkInStatus: string;
}

export interface BookingCheckOutStatusUpdate {
  checkOutStatus: string;
}
