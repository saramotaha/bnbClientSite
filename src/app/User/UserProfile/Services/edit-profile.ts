import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IEditProfile } from '../Models/iedit-profile';
import { Observable } from 'rxjs';
import { IuserData } from '../Models/iuser-data';

@Injectable({
  providedIn: 'root'
})
export class EditProfile {

  baseUrl: string = 'http://localhost:7145/api/Profile/editProfile';
  constructor(private http: HttpClient) { }

  UpdateProfile(ProfileData: IEditProfile): Observable<IuserData> {

    const token = localStorage.getItem('access_token'); 
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  });

    return this.http.put<IuserData>(this.baseUrl, ProfileData , { headers });
  }

}
