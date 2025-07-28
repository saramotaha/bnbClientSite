import { IbookingCreate } from "./ibooking-create"

export interface IBookingPayment {
    
    url:string
}

export interface IBookingPaymentRequest {
    booking :IbookingCreate
    url:string
}

    export interface PaymentCreateDto {
    propertyId: number;
    guestId: number;
    startDate: string; // YYYY-MM-DD format
    endDate: string;  // YYYY-MM-DD format
    totalGuests: number;
    promotionId?: number | null;
    amount: number;
    }


