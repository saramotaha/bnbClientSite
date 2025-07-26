import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  CreateViolationDTO,
  EditViolationDTO,
  ViolationDetailsDTO,
  ViolationListDTO
} from '../models/violation.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ViolationService {
  private baseUrl = '/api/violations';

  constructor(private http: HttpClient) {}

  // Submit a new violation report
  create(dto: CreateViolationDTO): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}`, dto);
  }

  // Get all violations (for admin or host view)
  getAll(): Observable<ViolationDetailsDTO[]> {
    return this.http.get<ViolationDetailsDTO[]>(`${this.baseUrl}`);
  }

  // Get violation details by ID
  getById(id: number): Observable<ViolationDetailsDTO> {
    return this.http.get<ViolationDetailsDTO>(`${this.baseUrl}/${id}`);
  }

  // Get violations by reporter (user)
  getByUserId(userId: number): Observable<ViolationListDTO[]> {
    return this.http.get<ViolationListDTO[]>(`${this.baseUrl}/user/${userId}`);
  }

  // Get violations tied to a specific property
  getByPropertyId(propertyId: number): Observable<ViolationListDTO[]> {
    return this.http.get<ViolationListDTO[]>(`${this.baseUrl}/property/${propertyId}`);
  }

  // Update violation status (Resolved, UnderReview, etc.)
  updateStatus(id: number, newStatus: string): Observable<string> {
    return this.http.put<string>(`${this.baseUrl}/${id}/status`, `"${newStatus}"`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Edit violation details (for admin panel)
  editViolation(id: number, dto: EditViolationDTO): Observable<string> {
    return this.http.put<string>(`${this.baseUrl}/${id}`, dto);
  }

  // Delete a violation by ID
  deleteViolation(id: number): Observable<string> {
    return this.http.delete<string>(`${this.baseUrl}/${id}`);
  }

  // Get all pending violations (admin filter)
  getPendingViolations(): Observable<ViolationListDTO[]> {
    return this.http.get<ViolationListDTO[]>(`${this.baseUrl}/pending`);
  }
}
