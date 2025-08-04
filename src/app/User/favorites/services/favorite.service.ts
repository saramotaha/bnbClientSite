import { Injectable } from "@angular/core"
import { Observable , of } from "rxjs"
import { Ifavorite } from "../models/ifavorite"
import { HttpClient } from "@angular/common/http"
import { AuthService } from "../../../Pages/Auth/auth.service"

@Injectable({providedIn: 'root'})
export class FavoriteService {
    private apiUrl = 'http://localhost:7145/api/Favourites';
    
    constructor(private http: HttpClient) {}

    getFavorites(userId: number): Observable<Ifavorite[]> {
        return this.http.get<Ifavorite[]>(`${this.apiUrl}/user/${userId}/favourites`);
    }

    addToFavorite(userId: number, propertyId: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/user/${userId}/${propertyId}`, {});
    }

   removeFavorite(userId: number, propertyId: number): Observable<any> {
  return this.http.delete(
    `${this.apiUrl}/user/${userId}/${propertyId}`,
    { responseType: 'text' } // Explicitly expect text response
  );
}
}