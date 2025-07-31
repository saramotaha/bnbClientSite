export interface HostVerification {
  id: number;
  hostId: number;
  VerificationType: string;
  status: VerificationStatus;
  documentUrl1:string;
  documentUrl2: string;
  submittedDate: Date;
  reviewedDate?: Date;
  AdminNotes? : string;
  hostname?: string;
  comments?: string;
    isChangingStatus?: boolean;

}
export interface HostVerificationResponse {
  message: string;
  verification: HostVerification;
}

export interface HostVerificationStatusUpdateDto {
  message: string
  verification: Verification
}

export interface Verification {
  id: number
  hostId: number
  type: string
  status: string
  documentUrl1: string
  documentUrl2: string
  submittedAt: string
  verifiedAt: string
  adminNotes: string
  host: any
}


export interface VerificationDocumentDto {
  id: number;
  documentType: string;
  fileName: string;
  fileUrl: string;
  uploadedDate: Date;
  isVerified: boolean;
}

export interface HostVerificationStatusUpdateDto {
  status: string;
  comments?: string;
  reviewedBy: string;
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
