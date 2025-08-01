import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUserProfile } from '../Models/iuser-profile';
import { HttpClient } from '@angular/common/http';
import { IUserReviews } from '../Models/iuser-reviews';

@Injectable({
  providedIn: 'root'
})
export class GetTripsOfUser {

  TripsUrl: string = `http://localhost:7145/api/Booking/ByGuestId/`;
  userReviews:string=`http://localhost:7145/api/Reviews/user/`

  constructor(private http:HttpClient) {}


  GetUserTrips(id: number): Observable<IUserProfile[]>{
    return this.http.get<IUserProfile[]>(`${this.TripsUrl}${id}`);

  }



  getReviewsOfUser(id: number): Observable<IUserReviews[]>{

    return this.http.get<IUserReviews[]>(`${this.userReviews}${id}`);



  }

}
