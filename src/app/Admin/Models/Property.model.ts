/** Represents an image associated with a property.*/
export interface PropertyImage {
  id: number;
  imageUrl: string;
  isCover: boolean;
}

/**
 * DTO for property list view - matches AdminPropertyListDto from backend
 */
export interface AdminPropertyListDto {
  id: number;
  title: string;
  description: string;
  hostName: string;
  hostEmail: string;
  address: string;
  city: string;
  country: string;
  pricePerNight: number;
  propertyType: string;
  status: 'pending' | 'active' | 'rejected' | 'suspended';
  images: PropertyImage[];
  averageRating?: number;
  bookingsCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * DTO for detailed property view - matches AdminPropertyResponseDto from backend
 */
export interface AdminPropertyResponseDto extends AdminPropertyListDto {
  numberOfBedrooms?: number;
  numberOfBathrooms?: number;
  amenities?: string[];
  adminNotes?: string;
  lastStatusChange?: Date;
  totalBookings?: number;
  totalRevenue?: number;
}

/**
 * NEW: DTO for detailed property information from the public Property controller
 * This represents the response from api/Property/{id} endpoint
 * Add properties based on what your PropertyController returns
 */
export interface PropertyDetailDto {
  id: number;
  title: string;
  description: string;
  hostName: string;
  hostEmail: string;
  address: string;
  city: string;
  country: string;
  pricePerNight: number;
  propertyType: string;
  numberOfBedrooms?: number;
  numberOfBathrooms?: number;
  maxGuests?: number;
  amenities?: string[];
  images: PropertyImage[];
  averageRating?: number;
  totalReviews?: number;
  bookingsCount?: number;
  isAvailable?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  // Add any other properties that your PropertyController returns
  // You may need to adjust these based on your actual DTO structure
}

/**
 * Legacy Property interface for backward compatibility
 * You can gradually migrate to use AdminPropertyListDto instead
 */
export interface Property extends AdminPropertyListDto {}

/**
 * Defines the structure for the payload when updating a property's status.
 */
export interface PropertyStatusUpdateDto {
  status: 'active' | 'rejected' | 'suspended';
  adminNotes?: string;
}

/**
 * DTO for soft delete operations
 */
export interface PropertySoftDeleteDto {
  adminNotes?: string;
}