// services/property.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Property } from '../../pt1/Models/property.model';
import { Observable } from 'rxjs';
import { AuthService } from '../../../../Pages/Auth/auth.service';

@Injectable({ providedIn: 'root' })
export class PropertyService {
  private baseUrl = 'http://localhost:7145/api/property';

  constructor(private http: HttpClient, private authService: AuthService) {}

  // 🔍 Get all properties for current host
  getAllByHost(): Observable<Property[]> {
    const hostId = Number(this.authService.getHostId());
    return this.http.get<Property[]>(`${this.baseUrl}/host/${hostId}`);
  }

  // 📄 Get property by ID
  getById(id: number): Observable<Property> {
    return this.http.get<Property>(`${this.baseUrl}/${id}`);
  }

  // 🔎 Search properties
  search(dto: any): Observable<Property[]> {
    return this.http.post<Property[]>(`${this.baseUrl}/search`, dto);
  }

  // 🧩 Update segments (example: title)
  setTitle(id: number, title: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/title`, { title });
  }

  setPricing(id: number, basePrice: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/pricing`, { basePrice });
  }

  setBookingSetting(id: number, bookingSetting: 'instant' | 'manual'): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/booking-setting`, { bookingSetting });
  }

}
