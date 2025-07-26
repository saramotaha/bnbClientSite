import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BookingCreateDto,
  BookingResponseDto,
  BookingUpdateDto,
  BookingStatusUpdateDto,
  BookingStatsDto,
  BookingSearchDto,
  BookingCheckInStatusUpdate,
  BookingCheckOutStatusUpdate
} from '../models/booking.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private baseUrl = '/api/booking';

  constructor(private http: HttpClient) {}

  getAll(): Observable<BookingResponseDto[]> {
    return this.http.get<BookingResponseDto[]>(this.baseUrl);
  }

  getById(id: number): Observable<BookingResponseDto> {
    return this.http.get<BookingResponseDto>(`${this.baseUrl}/${id}`);
  }

  getByGuestId(guestId: number): Observable<BookingResponseDto[]> {
    return this.http.get<BookingResponseDto[]>(`${this.baseUrl}/ByGuestId/${guestId}`);
  }

  getByPropertyId(propertyId: number): Observable<BookingResponseDto[]> {
    return this.http.get<BookingResponseDto[]>(`${this.baseUrl}/ByPropertyId/${propertyId}`);
  }

  create(booking: BookingCreateDto): Observable<number> {
    return this.http.post<number>(this.baseUrl, booking);
  }

  update(id: number, booking: BookingUpdateDto): Observable<string> {
    return this.http.put<string>(`${this.baseUrl}/${id}`, booking);
  }

  updateStatus(id: number, statusDto: BookingStatusUpdateDto): Observable<string> {
    return this.http.put<string>(`${this.baseUrl}/Update-Status/${id}`, statusDto);
  }

  updateCheckInStatus(id: number, dto: BookingCheckInStatusUpdate): Observable<string> {
    return this.http.put<string>(`${this.baseUrl}/Update-CheckInStatus/${id}`, dto);
  }

  updateCheckOutStatus(id: number, dto: BookingCheckOutStatusUpdate): Observable<string> {
    return this.http.put<string>(`${this.baseUrl}/Update-CheckOutStatus/${id}`, dto);
  }

  delete(id: number): Observable<string> {
    return this.http.delete<string>(`${this.baseUrl}/${id}`);
  }

  searchBookings(criteria: BookingSearchDto): Observable<BookingResponseDto[]> {
    return this.http.post<BookingResponseDto[]>(`${this.baseUrl}/Search`, criteria);
  }

  getStats(): Observable<BookingStatsDto> {
    return this.http.get<BookingStatsDto>(`${this.baseUrl}/Stats`);
  }
}
