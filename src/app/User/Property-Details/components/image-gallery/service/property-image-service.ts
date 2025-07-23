import { Injectable } from '@angular/core';
import { IpropertImageGallery } from '../iproperty-image-gallery';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PropertyImageService {
    propertyimagesSupject = new BehaviorSubject<IpropertImageGallery[]>([]);
    propertyimages$ = this.propertyimagesSupject.asObservable();  
    constructor(private http : HttpClient  ) {}

    getAllimagesPropertyId(id:Number) : Observable<IpropertImageGallery[]> {
        return this.http.get<IpropertImageGallery[]>(`http://localhost:7145/api/properties/1/images`)
          
          .pipe(
            tap(images=>{
              console.log('Fetched property images:', images);
              this.propertyimagesSupject.next(images);
            }),
            catchError(error => {
              if (error.status === 401) {
                console.error('Unauthorized access - redirecting to login');
                // Handle unauthorized access, e.g., redirect to login
              } else if (error.status === 404) {
                console.error('Property images not found');
                // Handle not found error
              } else {
                console.error('An unexpected error occurred:', error);    
                // Handle other errors
              }
              console.error('Error fetching property images:', error);
              return throwError(() => new Error('Failed to fetch property images'));
            }) ,
          );
    }

}

