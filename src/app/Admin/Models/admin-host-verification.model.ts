export interface HostVerification {
  id: number;
  hostId: number;
  VerificationType: string;
  status: VerificationStatus;
  documentUrl1: string;
  documentUrl2: string;
  submittedDate: Date;
  reviewedDate?: Date;
  AdminNotes?: string;
  hostname?: string;
  comments?: string;
  isChangingStatus?: boolean;
}

// New interface matching your API's AdminHostVerificationResponseDto
export interface AdminHostVerificationResponseDto {
  id: number;
  hostId: number;
  hostName?: string;
  hostEmail?: string;
  type: string;
  status: string;
  documentUrl1: string;
  documentUrl2: string;
  documentUrl1Full: string;
  documentUrl2Full: string;
  submittedAt: Date;
  verifiedAt?: Date;
  adminNotes?: string;
  isChangingStatus?: boolean;
}

export interface HostVerificationResponse {
  message: string;
  verification: HostVerification;
}

export interface HostVerificationStatusUpdateDto {
  message: string;
  verification: Verification;
}

export interface Verification {
  id: number;
  hostId: number;
  type: string;
  status: string;
  documentUrl1: string;
  documentUrl2: string;
  submittedAt: string;
  verifiedAt: string;
  adminNotes: string;
  host: any;
}

export interface VerificationDocumentDto {
  id: number;
  documentType: string;
  fileName: string;
  fileUrl: string;
  uploadedDate: Date;
  isVerified: boolean;
}

export interface AdminNotesDto {
  adminNotes?: string;
}

// Document viewing interfaces
export interface DocumentViewData {
  verificationId: number;
  documentNumber: number;
  fileName: string;
  fileUrl: string;
  fullFileUrl: string;
  isImage: boolean;
  isPdf: boolean;
  fileIcon: string;
}

export interface DocumentModalData {
  verification: AdminHostVerificationResponseDto;
  document1: DocumentViewData;
  document2: DocumentViewData;
}

export enum VerificationStatus {
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected',
}

export enum VerificationType {
  GovernmentID = 'government_id',
  Passport = 'passport',
  DrivingLicense = 'drivers_license',
  Other = 'other'
}

export interface VerificationFilters {
  status?: string;
  hostId?: number;
  verificationType?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

// Helper interface for document display
export interface DocumentDisplayInfo {
  fileName: string;
  fullUrl: string;
  isImage: boolean;
  isPdf: boolean;
  icon: string;
  canPreview: boolean;
}
