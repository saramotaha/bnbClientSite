import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Property } from '../Models/property.model';
import { AuthService } from '../../../../Pages/Auth/auth.service';

@Injectable({ providedIn: 'root' })
export class PropertyService {
    private listingData: any = {};
    private baseUrl = 'http://localhost:7145/api/property';  

  constructor(private http: HttpClient, private authService: AuthService) {}

  getAllByHost(): Observable<Property[]> {
    const hostId = Number(this.authService.getHostId());
    return this.http.get<Property[]>(`${this.baseUrl}/host/${hostId}`);
  }

  delete(id: number): Observable<void> {
  return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
  resetListingData() {
    this.listingData = {};
  }

 update(id: number, data: any): Observable<any> {
  return this.http.put(`${this.baseUrl}/${id}`, data);
}
getById(id: number): Observable<Property> {
  return this.http.get<Property>(`${this.baseUrl}/${id}`);
}

}
