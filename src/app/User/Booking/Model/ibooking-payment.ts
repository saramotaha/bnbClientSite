import { IbookingCreate } from "./ibooking-create"

export interface IBookingPayment {
    
    url:string
}

export interface IBookingPaymentRequest {
    booking :IbookingCreate
    url:string
}
