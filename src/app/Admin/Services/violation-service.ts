import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPViolation } from '../Models/ipviolation';

@Injectable({
  providedIn: 'root'
})
export class ViolationService {

  baseUrl:string="http://localhost:7145/api/Violations"

  constructor(private http: HttpClient) { }

  GetAllViolations():Observable<IPViolation[]> {
    return this.http.get<IPViolation[]>(`${this.baseUrl}`);
  }

  GetViolationById(id:number):Observable<IPViolation> {
    return this.http.get<IPViolation>(`${this.baseUrl}/${id}`);
  }

  EditViolationStatus(id:number , state:string):Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}/status`, state, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

}
