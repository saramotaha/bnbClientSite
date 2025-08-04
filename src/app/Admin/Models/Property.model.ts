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
 * FIXED: Defines the structure for the payload when updating a property's status.
 * Now includes 'pending' status to match AdminPropertyListDto
 */
export interface PropertyStatusUpdateDto {
  status: 'pending' | 'active' | 'rejected' | 'suspended'; // ✅ Added 'pending'
  adminNotes?: string;
}

/**
 * DTO for soft delete operations
 */
export interface PropertySoftDeleteDto {
  adminNotes?: string;
}

/**
 * OPTIONAL: Create specific DTOs for different operations if needed
 */

/**
 * For approving/rejecting pending properties
 */
export interface PropertyApprovalDto {
  status: 'active' | 'rejected';
  adminNotes?: string;
}

/**
 * For changing status of active properties
 */
export interface PropertyStatusChangeDto {
  status: 'active' | 'suspended';
  adminNotes?: string;
}

/**
 * Union type for all possible property statuses
 */
export type PropertyStatus = 'pending' | 'active' | 'rejected' | 'suspended';

/**
 * Helper function to check if a status is valid
 */
export function isValidPropertyStatus(status: string): status is PropertyStatus {
  return ['pending', 'active', 'rejected', 'suspended'].includes(status);
}

/**
 * Helper function to get display text for status
 */
export function getStatusDisplayText(status: PropertyStatus): string {
  switch (status) {
    case 'pending':
      return 'Pending Review';
    case 'active':
      return 'Active';
    case 'rejected':
      return 'Rejected';
    case 'suspended':
      return 'Suspended';
    default:
      return 'Unknown';
  }
}

/**
 * Helper function to get status color/class for UI
 */
export function getStatusCssClass(status: PropertyStatus): string {
  switch (status) {
    case 'pending':
      return 'status-pending'; // yellow/orange
    case 'active':
      return 'status-active'; // green
    case 'rejected':
      return 'status-rejected'; // red
    case 'suspended':
      return 'status-suspended'; // gray
    default:
      return 'status-unknown';
  }
}