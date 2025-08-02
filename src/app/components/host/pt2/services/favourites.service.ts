import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FavouritePropertiesDTO } from '../models/favourite.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FavouritesService {
  private baseUrl = '/api/favourites';

  constructor(private http: HttpClient) {}

  // Add a property to favourites
  addToFavourites(propertyId: number): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/${propertyId}`, {});
  }

  // Remove a property from favourites
  removeFromFavourites(propertyId: number): Observable<string> {
    return this.http.delete<string>(`${this.baseUrl}/${propertyId}`);
  }

  // Get all favourited properties for the current user
  getUserFavourites(): Observable<FavouritePropertiesDTO[]> {
    return this.http.get<FavouritePropertiesDTO[]>(`${this.baseUrl}`);
  }

  // Check if a specific property is favourited
  isFavourited(propertyId: number): Observable<{ isFavourited: boolean }> {
    return this.http.get<{ isFavourited: boolean }>(`${this.baseUrl}/check/${propertyId}`);
  }
}
