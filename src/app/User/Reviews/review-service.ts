import { Injectable, Input } from '@angular/core';
import { IReviews } from './Model/ireviews';
import { BehaviorSubject, catchError, Observable, pipe, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
   ReviewsSupject = new BehaviorSubject<IReviews[]>([]);
    Review$ = this.ReviewsSupject.asObservable();    
  constructor(private http : HttpClient) {}

  getReviewsForProperty(propertyId: number) :Observable<IReviews[]> {
    return this.http.get<IReviews[]>(`http://localhost:7145/api/Reviews/property/${propertyId}`)
      .pipe(
        tap(reviews => {
          console.log('Fetched property reviews:', reviews);
          this.ReviewsSupject.next(reviews); 
        }),
        catchError(error => {
          console.error('Error fetching property reviews:', error);
          return throwError(() => new Error('Failed to fetch property reviews'));
        })
      );


      


  }
}
