import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IbookingCreate, IBookingResponse } from '../Model/ibooking-create';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
    private bookingSubject = new BehaviorSubject<IbookingCreate[]>([]);
  booking$ = this.bookingSubject.asObservable();

  
  constructor(private http: HttpClient) {}

  createBooking(userId: number, booking: IbookingCreate): Observable<IBookingResponse> {
    return this.http.post<IBookingResponse>(`http://localhost:7145/api/Booking/CreateBookingByUser${userId}`, 
      booking)
    .pipe(
      tap((newBooking: IBookingResponse) => {
        const currentBookings = this.bookingSubject.value;
        this.bookingSubject.next([...currentBookings, newBooking]);
      }),
      catchError((error) => { 
        console.error('Booking creation failed', error);
        return throwError(() => new Error('Booking creation failed'));
      })

    );
  }

getBookingById(bookingId: number): Observable<IBookingResponse> {
    return this.http.get<IBookingResponse>(`http://localhost:7145/api/Booking/${bookingId}`)
      .pipe(
        tap((booking: IBookingResponse) => {
          console.log('Booking fetched successfully:', booking);
          const currentBookings = this.bookingSubject.value;

      }),
        catchError((error) => {
          console.error('Error fetching booking:', error);
          return throwError(() => new Error('Error fetching booking'));
        })
      ); 
  } 

  getBookingsByUserId(userId: number): Observable<IBookingResponse[]> {
    return this.http.get<IBookingResponse[]>(`http://localhost:7145/api/Booking/ByGuestId/${userId}`)
      .pipe(
        tap((bookings: IBookingResponse[]) => {
          console.log('Bookings fetched successfully:', bookings);
          this.bookingSubject.next(bookings);
        }),
        catchError((error) => {
          console.error('Error fetching bookings:', error);
          return throwError(() => new Error('Error fetching bookings'));
        })
      );
  }


}

  

