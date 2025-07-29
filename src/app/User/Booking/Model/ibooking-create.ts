export interface IbookingCreate {
    propertyId: number;
  startDate: string;       // send as "YYYY-MM-DD"
  endDate: string;         // send as "YYYY-MM-DD"
  totalGuests: number;
  promotionId?: number | null;  // nullable, backend uses default 0
}
// Response = IbookingCreate + extras
export interface IBookingResponse extends IbookingCreate {
  id: number;
  propertyTitle: string;
  propertyAddress: string;
  guestName: string;
  status: string;
  checkInStatus: string;
  checkOutStatus: string;
  totalAmount: number;
  createdAt: string;
}