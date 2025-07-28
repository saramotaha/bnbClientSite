import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, pipe, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IBookingPayment } from '../Model/ibooking-payment';
import { IbookingCreate } from '../Model/ibooking-create';

@Injectable({
  providedIn: 'root'
})
export class BookingPaymentService {
  constructor(private HttpClient : HttpClient ) {}
  private bookingPaymentSubject = new BehaviorSubject<IBookingPayment>({ url: '' });
  bookingPayment$ = this.bookingPaymentSubject.asObservable();


   getPaymentUrl(booking: IbookingCreate, amount: number): Observable<IBookingPayment> {
    const body = {
      booking,
      amount
    };

    return this.HttpClient
      .post<IBookingPayment>('http://localhost:7145/api/BookingPayment/create-checkout-session', body)
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



  
}
