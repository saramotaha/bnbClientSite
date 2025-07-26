export interface IbookingCreate {
     propertyId: number;
  startDate: Date;
  endDate: Date;
  totalGuests: number;
  promotionId?: number | null;
}
