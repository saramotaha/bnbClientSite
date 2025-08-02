import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { IHostProperty } from '../ihost-property';

@Injectable({
  providedIn: 'root'
})
export class PropertyHostService {
    propertyHostSupject = new BehaviorSubject<IHostProperty>({} as IHostProperty);
    Hostprop$ = this.propertyHostSupject.asObservable();
      constructor(private http:HttpClient){}

    getHostById(hostId:number):Observable<IHostProperty>{
      return this.http.get<IHostProperty>(`http://localhost:7145/api/Host/${hostId}`)
      .pipe(
        tap(hostDetails =>{
           console.log('Fetched Host details:', hostDetails);
          this.propertyHostSupject.next(hostDetails);
          }),
          catchError(error=>{
            return throwError(() => new Error('Failed to fetch property details'));
          })
      )
    }

}
