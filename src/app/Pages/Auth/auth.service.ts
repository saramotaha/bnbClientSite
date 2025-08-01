import { GoogleUser } from './google-auth.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { map, catchError, tap, switchMap } from 'rxjs/operators';
import { GoogleLoginResponse } from './user.model'; // Assuming you have this model defined
import { environment } from '../../../environments/environment.prod'; // Adjust the path as necessary

import {
  User,
  LoginDto,
  RegisterDto,
  AuthResponse,
  UserProfile,
  JwtPayload,
  GoogleAuthRequest,
} from './user.model';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
   private readonly API_URL = 'http://localhost:7145/api/Auth/';
  private readonly TOKEN_NAME = 'access_token';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initializeAuthState();
  }

  /** ✅ REGISTER */
  register(registerDto: RegisterDto): Observable<any> {
    return this.http.post<any>(`${this.API_URL}register`, registerDto).pipe(
      catchError(err => throwError(() => err))
    );
  }

  /** 🔑 LOGIN */
  login(loginDto: LoginDto): Observable<User> {
    return this.http.post<{ message: string }>(`${this.API_URL}login`, loginDto).pipe(
      switchMap((response) => {
        const token = response.message; // ✅ الآن نستخدم message بدلاً من token
        localStorage.setItem(this.TOKEN_NAME, token);

        const user = this.getUserFromToken(token);
        console.log('✅ User:', user);

        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);

        return of(user);
      }),
      catchError(err => {
        this.clearAuthState();
        return throwError(() => err);
      })
    );
  }

//   /** 👤 EXTRACT USER FROM TOKEN */
// private getUserFromToken(token: string): User {
//   const payload = jwtDecode<JwtPayload>(token);
//   console.log('Decoded JWT Payload:', payload);

//   // return {
//   //   id: payload.UserId || payload.nameidentifier || '',
//   //   firstName: payload.name || '',
//   //   email: payload.emailaddress || '',
//   //   role: payload.role || 'guest',
//   //   HostId: payload.HostId ? String(payload.HostId) : undefined
//   // };
//   return {
//   id: payload.UserID || payload.nameidentifier || '',
//   firstName: payload.firstName || '',
//   lastName: payload.lastName || '',
//   email: payload.email || '',
//   role: payload.role || 'guest',
//   HostId: payload.HostId ? String(payload.HostId) : undefined
// };

// }
  /** 👤 EXTRACT USER FROM TOKEN - FIXED */
 private getUserFromToken(token: string): User {
  const payload = jwtDecode<any>(token);

  const emailClaim = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress';
  const nameClaim = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name';
  const nameIdentifierClaim = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier';
  const roleClaim = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';

  // Normalize role to string[]
  let roles: string[] = [];

  const rawRoles = payload[roleClaim];

  if (Array.isArray(rawRoles)) {
    roles = rawRoles.map((r: string) => r.toLowerCase());
  } else if (typeof rawRoles === 'string') {
    roles = [rawRoles.toLowerCase()];
  }

  return {
    id: payload.UserID || payload[nameIdentifierClaim] || '',
    firstName: payload[nameClaim] || payload.firstName || '',
    lastName: payload.lastName || '',
    email: payload[emailClaim] || payload.email || '',
    role: roles, // ✅ always a string[]
    HostId: payload.HostId ? String(payload.HostId) : undefined,
    accessToken: token
  };
}


  /** ⏳ CHECK TOKEN EXPIRY */
  private isTokenExpired(token: string): boolean {
    const payload = jwtDecode<JwtPayload>(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp! < currentTime;
  }

  /** 🧹 LOGOUT / CLEAR STATE */
  logout(): void {
    localStorage.removeItem(this.TOKEN_NAME);
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  private clearAuthState(): void {
    this.logout();
  }

  private initializeAuthState(): void {
    const token = this.getToken();
    if (token && !this.isTokenExpired(token)) {
      const user = this.getUserFromToken(token);
      this.currentUserSubject.next(user);
      this.isAuthenticatedSubject.next(true);
    } else {
      this.clearAuthState();
    }
  }


  /** 👤 إرجاع ملف المستخدم الحالي */
getUserProfile(): User | null {
  return this.currentUserSubject.value;
  }

isAuthenticated(): boolean {
  return this.isAuthenticatedSubject.value;
}


  /** ✅ Get Host ID (if available) */
getHostId(): string | null {
  return this.currentUserSubject.value?.HostId || null;
  }

/** ✅ Get Logged-in User Full Name */
getUserFullName(): string {
  const user = this.currentUserSubject.value;
  return user ? user.firstName : '';
}


  /** ✅ Get Current User Object */
get currentUser(): User | null {
  return this.currentUserSubject.value;
}



  /** 🌐 Make Authenticated Request */
makeAuthenticatedRequest<T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string,
  body?: any
): Observable<T> {
  const headers = this.getAuthHeaders();
  switch (method) {
    case 'GET': return this.http.get<T>(url, { headers });
    case 'POST': return this.http.post<T>(url, body, { headers });
    case 'PUT': return this.http.put<T>(url, body, { headers });
    case 'DELETE': return this.http.delete<T>(url, { headers });
    default: throw new Error('Unsupported HTTP method');
  }
}



  /** 🔑 TOKEN HELPERS */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_NAME);
  }

  getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });
  }

    /** 🔍 Get User ID */
  getUserId(): string | null {
    return this.currentUserSubject.value?.id || null;

  }


//   // Add this method to your AuthService class:
// googleAuth(googleUser: GoogleUser): Observable<User> {
//   const googleAuthRequest: GoogleAuthRequest = {
//     email: googleUser.email,
//     firstName: googleUser.firstName,
//     lastName: googleUser.lastName,
//     idToken: googleUser.idToken
//   };
  

//   return this.http.post<GoogleLoginResponse>(`${this.API_URL}google-auth`, googleAuthRequest).pipe(
//     switchMap((response) => {
//       if (response.success && response.data) {
//         const token = response.data.token;
//         localStorage.setItem(this.TOKEN_NAME, token);

//         const user = this.getUserFromToken(token);
//         console.log('✅ Google Auth User:', user);

//         this.currentUserSubject.next(user);
//         this.isAuthenticatedSubject.next(true);

//         return of(user);
//       } else {
//         throw new Error(response.message || 'Google authentication failed');
//       }
//     }),
//     catchError(err => {
//       this.clearAuthState();
//       return throwError(() => err);
//     })
//   );
// }

// // Update the googleAuth method and add these helper methods:
// private createGoogleAuthRequest(googleUser: GoogleUser): GoogleAuthRequest {
//   return {
//     email: googleUser.email,
//     firstName: googleUser.firstName,
//     lastName: googleUser.lastName,
//     idToken: googleUser.idToken
//   };
// }
// Update your googleAuth method in auth.service.ts
googleAuth(googleUser: GoogleUser): Observable<User> {
  console.log('🚀 Starting Google Auth with user:', { 
    email: googleUser.email, 
    firstName: googleUser.firstName, 
    lastName: googleUser.lastName 
  });

  const googleAuthRequest: GoogleAuthRequest = {
    email: googleUser.email,
    firstName: googleUser.firstName,
    lastName: googleUser.lastName,
    idToken: googleUser.idToken
  };

  console.log('📤 Sending Google Auth request:', googleAuthRequest);

  return this.http.post<GoogleLoginResponse>(`${this.API_URL}google-auth`, googleAuthRequest, {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }).pipe(
    tap(response => {
      console.log('📥 Received Google Auth response:', response);
    }),
    switchMap((response) => {
      if (response.success && response.data) {
        const token = response.data.token;
        console.log('✅ Token received, storing in localStorage');
        localStorage.setItem(this.TOKEN_NAME, token);

        const user = this.getUserFromToken(token);
        console.log('✅ Google Auth User extracted:', user);

        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);

        return of(user);
      } else {
        console.error('❌ Google Auth failed:', response.message);
        throw new Error(response.message || 'Google authentication failed');
      }
    }),
    catchError(err => {
      console.error('❌ Google Auth HTTP Error:', err);
      
      // Log the full error for debugging
      if (err.error) {
        console.error('Error details:', err.error);
      }
      
      this.clearAuthState();
      return throwError(() => new Error(`Google authentication failed: ${err.error?.message || err.message || 'Unknown error'}`));
    })
  );



}

// Method to handle Google authentication response
handleGoogleAuthResponse(response: GoogleLoginResponse): Observable<User> {
  if (response.success && response.data) {
    const token = response.data.token;
    localStorage.setItem(this.TOKEN_NAME, token);

    const user = this.getUserFromToken(token);
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);

    return of(user);
  } else {
    throw new Error(response.message || 'Google authentication failed');


}


}

}
