import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IAdminPayment } from '../../Core/Models/iadmin-payment';

@Injectable({
  providedIn: 'root'
})
export class BookingPayoutService {

  BaseURl: string = 'http://localhost:7145/api/BookingPayout/AdmenGetAllPayout';
  ReleaseURl: string = 'http://localhost:7145/api/BookingPayout/AdmenReleasePayout/';
  constructor(private http : HttpClient) {}

  GetAllBookingPayout():Observable<IAdminPayment[]> {
   return this.http.get<IAdminPayment[]>(`${this.BaseURl}`);
  }


  ReleasePayout(id:number):Observable<any> {
   return this.http.post(`${this.ReleaseURl}${id}`,null);
  }

}
