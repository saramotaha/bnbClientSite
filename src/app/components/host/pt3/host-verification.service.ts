// services/host-verification.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { 
  HostVerificationRequest, 
  HostVerification
} from '../pt3/host-verification.model';
@Injectable({
  providedIn: 'root'
})
export class HostVerificationService {
  private readonly baseUrl = 'https://localhost:7145/api/HostVerification';

  constructor(private http: HttpClient) {}

  /**
   * Add a new host verification with document files
   */
  addHostVerification(verificationData: HostVerificationRequest): Observable<HostVerification> {
    const formData = new FormData();
    
    // Append form data
    formData.append('type', verificationData.type);
    formData.append('documentUrl1', verificationData.documentUrl1);
    formData.append('documentUrl2', verificationData.documentUrl2);

    return this.http.post<HostVerification>(this.baseUrl, formData)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      switch (error.status) {
        case 400:
          errorMessage = error.error?.error || 'Please enter required data';
          break;
        case 401:
          errorMessage = 'Unauthorized access';
          break;
        case 409:
          errorMessage = 'Verification already exists for this type';
          break;
        case 500:
          errorMessage = 'Server error occurred';
          break;
        default:
          errorMessage = `Error: ${error.status}`;
      }
    }
    
    console.error('HostVerificationService Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}