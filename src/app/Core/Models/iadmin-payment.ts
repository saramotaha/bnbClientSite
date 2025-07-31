export interface IAdminPayment {

  id: number
  amount: number
  status: string
  createdAt: string
  bookingId: number
  propertyTitle: string
  guestFullName: string
  hostFullName: string
}
