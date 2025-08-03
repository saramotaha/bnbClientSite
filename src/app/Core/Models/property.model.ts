
// models/property.model.ts
export interface Property {
  id: number;
  title: string;
  description: string;
  city: string;
  country: string;
  status: string;
  pricePerNight: number;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  address: string;
  propertyTypeName: string;
  hostName: string;
  amenityNames: string[];
  images: {
    id: number;
    imageUrl: string;
    description: string;
    isPrimary: boolean;
    category: string;
    createdAt: string;
  }[];
}