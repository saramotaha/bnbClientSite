import { ChangeDetectorRef, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateAvailabilityDTO } from '../models/availability.model';
// import { AuthService } from '../../../../Pages/Auth/auth.service';

@Injectable({ providedIn: 'root' })
export class AvailabilityService {
  private baseUrl = '/api/availability';

  constructor(private http: HttpClient) {}

  //  NEW: Get availability for current host, with optional filtering
 getCurrentHostAvailability(month?: number, year?: number): Observable<CreateAvailabilityDTO[]> {
    const hostId = 3; // Still hardcoded (replace with authService if needed later)
    let params = new HttpParams();
    
    if (month !== undefined) params = params.set('month', month.toString());
    if (year !== undefined) params = params.set('year', year.toString());

    return this.http.get<CreateAvailabilityDTO[]>(`${this.baseUrl}/host/${hostId}`, { params });
  }

  getByPropertyId(propertyId: number): Observable<CreateAvailabilityDTO[]> {
    return this.http.get<CreateAvailabilityDTO[]>(`${this.baseUrl}/${propertyId}`);
  }

  addAvailability(dto: CreateAvailabilityDTO): Observable<string> {
    return this.http.post<string>(this.baseUrl, dto);
  }

  updateAvailability(id: number, dto: CreateAvailabilityDTO): Observable<string> {
    return this.http.put<string>(`${this.baseUrl}/${id}`, dto);
  }

  deleteAvailability(id: number): Observable<string> {
    return this.http.delete<string>(`${this.baseUrl}/${id}`);
  }

  getAllAvailability(): Observable<CreateAvailabilityDTO[]> {
    return this.http.get<CreateAvailabilityDTO[]>(this.baseUrl);
  }
}
