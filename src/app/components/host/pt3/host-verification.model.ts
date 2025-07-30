// models/host-verification.model.ts

export enum TypeOfVerification {
  GOVERNMENT_ID = 'government_id',
  DRIVING_LICENSE = 'drivinglicense',
  PASSPORT = 'passport',
  OTHER = 'other'
}

export interface HostVerificationRequest {
  type: TypeOfVerification;
  documentUrl1: File;
  documentUrl2: File;
}

export interface HostVerification {
  id?: number;
  hostId?: number;
  type: string;
  status?: string;
  documentUrl1?: string;
  documentUrl2?: string;
  submittedAt?: Date;
}