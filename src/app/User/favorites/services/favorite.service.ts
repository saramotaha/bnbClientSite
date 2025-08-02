import { Injectable } from "@angular/core"
import { Observable , of } from "rxjs"
import { Ifavorite } from "../models/ifavorite"
import { HttpClient } from "@angular/common/http"
//import { dummyFavorites } from "../dummy-favorites"

@Injectable({providedIn:'root'})
export class FavoriteService{
    private apiUrl ='https://localhost:7145/api/Favourites';
    constructor (private http:HttpClient){}
    getFavorites():Observable<Ifavorite[]>{
        return this.http.get<Ifavorite[]>(this.apiUrl);
    }
    removeFavorite(propertyId: number) {
   return this.http.delete(`${this.apiUrl}/${propertyId}`, { responseType: 'text' });
}

}