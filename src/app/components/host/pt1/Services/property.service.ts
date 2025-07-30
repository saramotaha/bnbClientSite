import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Property } from '../Models/property.model';

@Injectable({ providedIn: 'root' })
export class PropertyService {
    private listingData: any = {};

  private baseUrl = 'http://localhost:7145/api/property';    

  constructor(private http: HttpClient) {}

  getAllByHost(): Observable<Property[]> {
    return this.http.get<Property[]>(`${this.baseUrl}`);
  }
  delete(id: number): Observable<void> {
  return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
  resetListingData() {
    this.listingData = {};
  }
}
