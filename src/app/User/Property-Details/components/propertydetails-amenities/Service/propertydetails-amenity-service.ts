import { ChangeDetectorRef, Injectable } from '@angular/core';
/* import { AmenitiesList } from './../../../../../components/amenities-list/amenities-list';
 */import { IpropertyAmenity } from '../iproperty-amenity';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PropertydetailsAmenityService {
  PropertyAmentiesSupject = new BehaviorSubject<IpropertyAmenity[]>([]);
  PropertyAmenties$ = this.PropertyAmentiesSupject.asObservable();

  constructor(private Http :HttpClient) {}

  getAmenitiesForProperty(id:number):Observable<IpropertyAmenity[]>{
    return this.Http.get<IpropertyAmenity[]>(`http://localhost:7145/api/PropertyAmenity/${id}`)
      .pipe(
        tap(amenities => {
          console.log('Fetched property amenities:', amenities);
          this.PropertyAmentiesSupject.next(amenities); 
        }),
        catchError(error => {
          console.error('Error fetching property amenities:', error);
          return throwError(() => new Error('Failed to fetch property amenities'));
        })
      );
  }
  
}
