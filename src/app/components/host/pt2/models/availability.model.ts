export interface CreateAvailabilityDTO {
  propertyId: number;
  date: string; // ISO string format
  isAvailable: boolean;
  blockedReason?: string;
  price: number;
  minNights: number;
}
