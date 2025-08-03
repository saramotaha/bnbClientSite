// In your property-details.ts or a shared types file
export enum ViolationType {
  PropertyMisrepresentation = 0,//'PropertyMisrepresentation',
  HostMisconduct = 1,//'HostMisconduct',
  SafetyIssue = 2,//'SafetyIssue',
  PolicyViolation = 3, //'PolicyViolation',
  FraudulentActivity = 4,//'FraudulentActivity',
  Other = 'Other'
}


export interface CreateViolationDTO {
  reportedById: number;
  reportedPropertyId: number;
  reportedHostId: number;
  violationType: ViolationType; // Now using the enum type
  description: string;
}

export interface EditViolationDTO {
  violationType: string;
  description: string;
  status: string;
  adminNotes?: string;
}

export interface ReportedUserDTO {
  id: number;
  fullName: string;
  profilePictureUrl: string;
  role: string;
  emailVerified: boolean;
}

export interface ReportedHostDTO {
  id: number;
  fullName: string;
  livesIn: string;
  isVerified: boolean;
  rating: number;
  stripeAccountId?: string;
}

export interface ReportedPropertyDTO {
  id: number;
  title: string;
  city: string;
  country: string;
  status: string;
  primaryImage?: string;
}

export interface ViolationDetailsDTO {
  id: number;
  violationType: string;
  status: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  adminNotes?: string;
  reporter: ReportedUserDTO;
  host?: ReportedHostDTO;
  property?: ReportedPropertyDTO;
}

export interface ViolationListDTO {
  id: number;
  violationType: string;
  status: string;
  createdAt: string;
  reporterName: string;
  propertyTitle?: string;
  hostName?: string;
}
