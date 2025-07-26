import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IFilterHomes } from '../Models/ifilter-homes';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterHomesServices {

  BaseUrl: string = 'http://localhost:7145/api/Property/search';
  Filters!: {};

  constructor(private http: HttpClient) { }

  GetHomes(homes:IFilterHomes):Observable<any> {
    return this.http.post(`${this.BaseUrl}`, homes);
  }

}
