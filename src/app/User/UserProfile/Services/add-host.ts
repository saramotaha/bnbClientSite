import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAddHost } from '../Models/iadd-host';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddHost {

  baseUrl: string = 'http://localhost:7145/api/Auth/register-host';

  constructor(private http: HttpClient) { }

  AddHost(hostData: IAddHost): Observable<any> {
     const token = localStorage.getItem('access_token');

    // نجهز الـ headers
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>(`${this.baseUrl}`,hostData , { headers })
  }

}
