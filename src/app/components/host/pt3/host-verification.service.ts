import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HostVerification, HostVerificationRequest, TypeOfVerification } from './host-verification.model';
import { AuthService } from '../../../Pages/Auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class HostVerificationService {
  private readonly API_URL = 'http://localhost:7145/api/HostVerification';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  /** ✅ FIXED: ADD HOST VERIFICATION */
  addVerification(verificationData: HostVerificationRequest): Observable<HostVerification> {
    const formData = new FormData();
    
    // ✅ FIX 1: Add the verification type correctly
    formData.append('Type', verificationData.type.toString());
    
    // ✅ FIX 2: Actually append the files (this was missing!)
    formData.append('DocumentUrl1', verificationData.documentUrl1, verificationData.documentUrl1.name);
    formData.append('DocumentUrl2', verificationData.documentUrl2, verificationData.documentUrl2.name);
    
    // ✅ FIX 3: Add current timestamp
    formData.append('SubmittedAt', new Date().toISOString());

    // ✅ FIX 4: DO NOT set Content-Type header for FormData - let browser set it automatically
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
      // ❌ Don't set Content-Type for FormData uploads
    });

    console.log('📤 Sending verification request...');
    console.log('Type:', verificationData.type);
    console.log('File 1:', verificationData.documentUrl1.name, verificationData.documentUrl1.size);
    console.log('File 2:', verificationData.documentUrl2.name, verificationData.documentUrl2.size);

    // ✅ FIX 5: Use correct endpoint that matches your controller
    return this.http.post<HostVerification>(`${this.API_URL}/AddVerifications`, formData, { headers })
      .pipe(
        catchError(error => {
          console.error('❌ Verification submission failed:', error);
          console.error('Full error response:', error.error);
          return throwError(() => error);
        })
      );
  }

  /** ✅ GET HOST VERIFICATIONS */
  getHostVerifications(): Observable<HostVerification[]> {
    const headers = this.authService.getAuthHeaders();
    
    return this.http.get<HostVerification[]>(`${this.API_URL}/GetHostVerifications`, { headers })
      .pipe(
        catchError(error => {
          console.error('❌ Failed to get verifications:', error);
          return throwError(() => error);
        })
      );
  }

  /** ✅ GET VERIFICATION BY ID */
  getVerificationById(id: number): Observable<HostVerification> {
    const headers = this.authService.getAuthHeaders();
    
    return this.http.get<HostVerification>(`${this.API_URL}/GetVerification/${id}`, { headers })
      .pipe(
        catchError(error => {
          console.error('❌ Failed to get verification:', error);
          return throwError(() => error);
        })
      );
  }

  /** ✅ UPDATE VERIFICATION */
  updateVerification(id: number, verificationData: HostVerificationRequest): Observable<HostVerification> {
    const formData = new FormData();
    
    formData.append('Type', verificationData.type.toString());
    formData.append('DocumentUrl1', verificationData.documentUrl1, verificationData.documentUrl1.name);
    formData.append('DocumentUrl2', verificationData.documentUrl2, verificationData.documentUrl2.name);
    formData.append('SubmittedAt', new Date().toISOString());

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });

    return this.http.put<HostVerification>(`${this.API_URL}/UpdateVerification/${id}`, formData, { headers })
      .pipe(
        catchError(error => {
          console.error('❌ Verification update failed:', error);
          return throwError(() => error);
        })
      );
  }

  /** ✅ DELETE VERIFICATION */
  deleteVerification(id: number): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    
    return this.http.delete(`${this.API_URL}/DeleteVerification/${id}`, { headers })
      .pipe(
        catchError(error => {
          console.error('❌ Verification deletion failed:', error);
          return throwError(() => error);
        })
      );
  }

  /** ✅ CHECK IF HOST HAS VERIFICATION TYPE */
  hasVerificationType(type: TypeOfVerification): Observable<boolean> {
    return new Observable(observer => {
      this.getHostVerifications().subscribe({
        next: (verifications) => {
          const hasType = verifications.some(v => v.type === type);
          observer.next(hasType);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }
}