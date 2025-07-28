import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, pipe, tap, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { IBookingPayment, IBookingPaymentRequest, PaymentCreateDto } from '../Model/ibooking-payment';
import { IbookingCreate } from '../Model/ibooking-create';

@Injectable({
  providedIn: 'root'
})
export class BookingPaymentService {
  constructor(private HttpClient : HttpClient ) {}
    private apiUrl = 'http://localhost:7145/api/BookingPayment';
  private bookingPaymentSubject = new BehaviorSubject<IBookingPayment>({ url: '' });
  bookingPayment$ = this.bookingPaymentSubject.asObservable();


   getPaymentUrl(booking: PaymentCreateDto): Observable<IBookingPayment> {
 
    return this.HttpClient
      .post<IBookingPayment>('http://localhost:7145/api/BookingPayment/create-checkout-session', booking)
      .pipe(
        tap((response) => {
          this.bookingPaymentSubject.next(response);
        }),
        catchError((error) => {
          console.error('Error fetching payment URL:', error);
          return throwError(() => new Error('Error fetching payment URL'));
        })
      );
  }

/* 
 getPaymentUrl(bookingData: any): Observable<any> {
    // Ensure amount is in cents and properly formatted
    const payload = {
      ...bookingData,
      amount: Math.round(bookingData.amount * 100) // Convert to cents
    };

    return this.HttpClient.post<any>(`${this.apiUrl}/create-checkout-session`, payload)
      .pipe(
        tap(response => {
          console.log('Payment URL received:', response);
          this.bookingPaymentSubject.next(response);
        }),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Payment API Error:', error);
    
    let errorMessage = 'Payment failed';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      if (error.error?.message) {
        errorMessage += `\nDetails: ${error.error.message}`;
      }
    }
    return throwError(() => new Error(errorMessage));
  }
 */
  
}
