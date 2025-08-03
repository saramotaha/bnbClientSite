import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthService } from "../../Pages/Auth/auth.service";
import { Observable, forkJoin, map, switchMap } from 'rxjs';


@Injectable({
    providedIn:'root'
})

export class RecommendationService {
  private baseUrl = 'http://localhost:7145/api';
    constructor(private http:HttpClient, private authService:AuthService){}
      getRecommendations(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/Recommendations/user/${userId}`).pipe(
      switchMap(recommendations => {
        // Fetch all properties in parallel
        const propertyRequests = recommendations.map(rec => 
          this.http.get<any>(`${this.baseUrl}/Property/${rec.propertyId}`).pipe(
            map(property => ({ 
              property, 
              score: rec.score,
              matchPercentage: Math.round(rec.score * 100)
            }))
          )
        );
        return forkJoin(propertyRequests);
      })
    );
  }
}