// Models/Property.ts
export interface PropertyImage {
  id: number;
  imageUrl: string;
  description: string;
  isPrimary: boolean;
  category: string;
  createdAt: string;
}

export interface AvailabilityDate {
  date: string;
  isAvailable: boolean;
  price: number;
  blockedReason: string;
  minNights: number;
}

export interface Property {
  id: number;
  title: string;
  description: string;
  pricePerNight: number;
  maxGuests: number;
  numOfBedrooms: number;
  numOfBathrooms: number;
  address: string;
  propertyTypeName: string;
  hostName: string;
  amenityNames: string[];
  images: PropertyImage[];
  availabilityDates: AvailabilityDate[];
}
