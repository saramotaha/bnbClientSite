
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { Irecomme } from '../models/irecomm';
import { HttpClient } from "@angular/common/http";


@Injectable({providedIn:'root'})
export class RecommendationService{
    private apiUrl='https://localhost:7145/api/Recommendations';
    constructor(private http:HttpClient){}
    getRecommendations(userId:number):Observable<Irecomme[]>{
        return this.http.get<Irecomme[]>(`${this.apiUrl}/user/${userId}`);
    }
}