import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IFilterHomes } from '../Models/ifilter-homes';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterHomesServices {

  BaseUrl: string = 'http://localhost:7145/api/Property/search';
  // Filters!: {};

  private filtersSubject = new BehaviorSubject<{}>({});
  filters$ = this.filtersSubject.asObservable();



 setFilters(filters: {}) {
   this.filtersSubject.next(filters);
   localStorage.setItem("filters", JSON.stringify(filters));
  }

  constructor(private http: HttpClient) {
    const savedFilters = localStorage.getItem('filters');
    if (savedFilters) {
      this.filtersSubject.next(JSON.parse(savedFilters));
    }
   }



  GetHomes(homes:IFilterHomes):Observable<any> {
    return this.http.post(`${this.BaseUrl}`, homes);
  }

}
