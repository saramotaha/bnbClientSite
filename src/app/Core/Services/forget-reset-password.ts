import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IForgetPassWord, IResetPassWord } from '../Models/ireset-pass-word';

@Injectable({
  providedIn: 'root'
})
export class ForgetResetPassword {

  BaseUrl: string = 'http://localhost:7145/api/Auth/';
  constructor(private http: HttpClient) { }

  ForgetPassWord( ForgetPass:IForgetPassWord):Observable<any> {
    return this.http.post<any>(`${this.BaseUrl}forgotPassword`,ForgetPass);
  }

  ResetPassWord( NewReset:IResetPassWord):Observable<any> {
    return this.http.post(`${this.BaseUrl}resetPassword` ,NewReset )
  }

}
