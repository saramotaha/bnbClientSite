import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CreateAvailabilityDTO } from '../models/availability.model';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })

export class AvailabilityService {
  //can use environment variable for baseUrl if needed
  private baseUrl = '/api/availability';

  constructor(private http: HttpClient) {}

  // Get availability slots for a specific property
  getByPropertyId(propertyId: number): Observable<CreateAvailabilityDTO[]> {
    return this.http.get<CreateAvailabilityDTO[]>(`${this.baseUrl}/${propertyId}`);
  }

  // Get availability slots across all host-owned properties
  getByHostId(hostId: number): Observable<CreateAvailabilityDTO[]> {
    return this.http.get<CreateAvailabilityDTO[]>(`${this.baseUrl}/host/${hostId}`);
  }

  // Create a new availability slot
  addAvailability(dto: CreateAvailabilityDTO): Observable<string> {
    return this.http.post<string>(this.baseUrl, dto);
  }

  // Update an existing availability slot by ID
  updateAvailability(id: number, dto: CreateAvailabilityDTO): Observable<string> {
    return this.http.put<string>(`${this.baseUrl}/${id}`, dto);
  }

  // Delete an availability slot by ID
  deleteAvailability(id: number): Observable<string> {
    return this.http.delete<string>(`${this.baseUrl}/${id}`);
  }

  // Get all availability slots (admin or host role)
  getAllAvailability(): Observable<CreateAvailabilityDTO[]> {
    return this.http.get<CreateAvailabilityDTO[]>(this.baseUrl);
  }
}
