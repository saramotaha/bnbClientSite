import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser } from '../Models/iuser';
import { IUserData } from '../Models/iuser-data';
import { IAddUser } from '../Models/iadd-user';
import { IUserBan } from '../Models/iuser-ban';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  BaseUrl: string = "http://localhost:7145/api/admin/users";
  AddUserBaseUrl: string = "http://localhost:7145/api/Auth/register";

  constructor(private http: HttpClient) { }

  GetAllUsers():Observable<IUser[]> {
    return this.http.get<IUser[]>(`${this.BaseUrl}`);
  }

  GetUserData(id:number):Observable<IUserData> {
    return this.http.get<IUserData>(`${this.BaseUrl}/${id}`);
  }

  AddUser( user:IAddUser):Observable<IAddUser> {
    return this.http.post<IAddUser>(`${this.AddUserBaseUrl}`, user);

  }

  BanUser(id:number ,User:IUserBan):Observable<IUserBan> {
   return this.http.put<IUserBan>(`${this.BaseUrl}/${id}/ban` ,User );
  }

}
