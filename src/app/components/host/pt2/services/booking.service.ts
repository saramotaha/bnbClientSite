// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import {
//   BookingCreateDto,
//   BookingResponseDto,
//   BookingUpdateDto,
//   BookingStatusUpdateDto,
//   BookingStatsDto,
//   BookingSearchDto,
//   BookingCheckInStatusUpdate,
//   BookingCheckOutStatusUpdate
// } from '../models/booking.model';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class BookingService {
//   private baseUrl = '/api/booking';

//   constructor(private http: HttpClient) {}

//   getAll(): Observable<BookingResponseDto[]> {
//     return this.http.get<BookingResponseDto[]>(this.baseUrl);
//   }

//   getBookingById(id: number): Observable<BookingResponseDto> {
//     return this.http.get<BookingResponseDto>(`${this.baseUrl}/${id}`);
//   }

//   createBooking(userId: number, dto: BookingCreateDto): Observable<number> {
//     return this.http.post<number>(`${this.baseUrl}/CreateBookingByUserId${userId}`, dto);
//   }

//   updateBooking(id: number, dto: BookingUpdateDto): Observable<string> {
//     return this.http.put<string>(`${this.baseUrl}/${id}`, dto);
//   }

//   updateBookingStatus(id: number, dto: BookingStatusUpdateDto): Observable<string> {
//     return this.http.put<string>(`${this.baseUrl}/Update-Status/${id}`, dto);
//   }

//   updateCheckInStatus(id: number, dto: BookingCheckInStatusUpdate): Observable<string> {
//     return this.http.put<string>(`${this.baseUrl}/Update-CheckInStatus/${id}`, dto);
//   }

//   updateCheckOutStatus(id: number, dto: BookingCheckOutStatusUpdate): Observable<string> {
//     return this.http.put<string>(`${this.baseUrl}/Update-CheckOutStatus/${id}`, dto);
//   }

//   deleteBooking(id: number): Observable<string> {
//     return this.http.delete<string>(`${this.baseUrl}/${id}`);
//   }

//   getBookingsByGuest(guestId: number): Observable<BookingResponseDto[]> {
//     return this.http.get<BookingResponseDto[]>(`${this.baseUrl}/ByGuestId/${guestId}`);
//   }

//   getBookingsByProperty(propertyId: number): Observable<BookingResponseDto[]> {
//     return this.http.get<BookingResponseDto[]>(`${this.baseUrl}/ByPropertyId/${propertyId}`);
//   }

//   searchBookings(criteria: BookingSearchDto): Observable<BookingResponseDto[]> {
//     return this.http.post<BookingResponseDto[]>(`${this.baseUrl}/Search`, criteria);
//   }

//   getBookingStats(): Observable<BookingStatsDto> {
//     return this.http.get<BookingStatsDto>(`${this.baseUrl}/Stats`);
//   }
//   getBookingsByHost(hostId: number): Observable<BookingResponseDto[]> {
//   return this.http.get<BookingResponseDto[]>(`${this.baseUrl}/host/${hostId}`);
// }

// }
