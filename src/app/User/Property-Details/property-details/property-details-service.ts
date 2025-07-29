import { ChangeDetectorRef, Injectable } from '@angular/core';
import { PropertyDetails } from './property-details';
import { IPropertyList } from './../../../Core/Models/iproperty-list';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PropertyDetailsService {
  PropertyDetailsSupject = new BehaviorSubject<IPropertyList>({} as IPropertyList);
  PropertyDetails$ = this.PropertyDetailsSupject.asObservable();
  
  constructor(private http :HttpClient) {}
  
  getPropertyDetailsById(id: number): Observable<IPropertyList> {
    return this.http.get<IPropertyList>(`http://localhost:7145/api/Property/${id}`)
      .pipe(
        tap(propertyDetails => {
          console.log('Fetched property details:', propertyDetails);
          this.PropertyDetailsSupject.next(propertyDetails);
        }),
        catchError(error => {
          if (error.status === 401) {
            console.error('Unauthorized access - redirecting to login');
            // Handle unauthorized access, e.g., redirect to login
          } else if (error.status === 404) {
            console.error('Property details not found');
            // Handle not found error
          } else {
            console.error('An unexpected error occurred:', error);
            // Handle other errors
          }
          return throwError(() => new Error('Failed to fetch property details'));
        })
      );
  }
}
