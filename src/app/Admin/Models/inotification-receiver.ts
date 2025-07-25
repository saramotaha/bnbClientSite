export interface INotificationReceiver {

  firstName: string
  lastName: string
  dateOfBirth: string
  gender: string
  profilePictureUrl: string
  accountStatus: string
  emailVerified: boolean
  phoneVerified: boolean
  createdAt: string
  updatedAt: string
  lastLogin: string
  role: string
  refreshToken: any
  refreshTokenExpiryTime: any
  reviews: any[]
  id: number
  userName: string
  normalizedUserName: string
  email: string
  normalizedEmail: string
  emailConfirmed: boolean
  passwordHash: string
  securityStamp: string
  concurrencyStamp: string
  phoneNumber: string
  phoneNumberConfirmed: boolean
  twoFactorEnabled: boolean
  lockoutEnd: any
  lockoutEnabled: boolean
  accessFailedCount: number
}
