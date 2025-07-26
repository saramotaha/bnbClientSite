import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPropertyList } from '../Models/iproperty-list';
import { IFavProperties } from '../Models/ifav-properties';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  PropUrl: string = "http://localhost:7145/api/Property";
  FavProperty: string = "http://localhost:7145/api/Favourites";
  // PropReviews: string = "http://localhost:7145/api/Reviews/property/";


  constructor(private http: HttpClient) { }

  GetPopularHomes(): Observable<IPropertyList[]> {
    return this.http.get<IPropertyList[]>(`${this.PropUrl}`);
  }


  GetFavProp():Observable<IFavProperties[]> {
    return this.http.get<IFavProperties[]>(`${this.FavProperty}`)
  }




}
