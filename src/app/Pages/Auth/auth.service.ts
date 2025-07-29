// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
// import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
// import { map, catchError, tap, switchMap } from 'rxjs/operators';
// import { 
//   User, 
//   LoginDto, 
//   RegisterDto, 
//   AuthResponse,
//   UserProfile,
//   JwtPayload 
// } from './user.model';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private readonly API_URL = 'https://localhost:7145/api/auth';
//   private readonly COOKIE_NAME = 'access_token';
  
//   private currentUserSubject = new BehaviorSubject<User | null>(null);
//   public currentUser$ = this.currentUserSubject.asObservable();

//   private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
//   public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

//   constructor(private http: HttpClient) {
//     this.initializeAuthState();
//   }

//   // Initialize authentication state from cookie
//   private initializeAuthState(): void {
//     const token = this.getTokenFromCookie();
//     if (token && !this.isTokenExpired(token)) {
//       const user = this.getUserFromToken(token);
//       if (user) {
//         user.accessToken = token;
//         this.currentUserSubject.next(user);
//         this.isAuthenticatedSubject.next(true);
//       }
//     } else {
//       this.clearAuthState();
//     }
//   }

//   // Register new user
//   register(registerDto: RegisterDto): Observable<RegisterDto> {
//     const payload = {
//       firstName: registerDto.firstName,
//       lastName: registerDto.lastName,
//       email: registerDto.email,
//       password: registerDto.password,
//       confirmPassword: registerDto.confirmPassword,
//       ...(registerDto.phoneNumber && { phoneNumber: registerDto.phoneNumber })
//     };

//     return this.http.post<RegisterDto>(`${this.API_URL}/register`, payload, {
//       headers: this.getHttpHeaders()
//     }).pipe(
//       tap(response => {
//         console.log('Registration successful:', response);
//       }),
//       catchError(this.handleError)
//     );
//   }

//  login(loginDto: LoginDto): Observable<User> {
//   return this.http.post<{ message: string }>(
//     `${this.API_URL}/login`,
//     loginDto,
//     { withCredentials: true }
//   ).pipe(
//     switchMap(() => {
//       const token = this.getTokenFromCookie();
//       if (!token) throw new Error('No token found');
      
//       const user = this.getUserFromToken(token);
//       this.currentUserSubject.next(user);
//       this.isAuthenticatedSubject.next(true);
      
//       // Only fetch host data if user is a host
//       if (this.isHost()) {
//         this.fetchHostId().subscribe(hostId => {
//           console.log('Host ID:', hostId); // For debugging
//         });
//       }
      
//       return of(user);
//     }),
//     catchError(err => {
//       this.clearAuthState();
//       return throwError(() => err);
//     })
//   );
// }

//   logout(): Observable<void> {
//     return this.http.post<void>(
//       `${this.API_URL}/LogOut`, 
//       {}, 
//       { withCredentials: true }
//     ).pipe(
//       tap(() => {
//         this.clearAuthState();
//       }),
//       catchError(error => {
//         this.clearAuthState();
//         return throwError(() => error);
//       })
//     );
//   }

//   private clearAuthState(): void {
//     document.cookie = `${this.COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
//     this.currentUserSubject.next(null);
//     this.isAuthenticatedSubject.next(false);
//     console.log('Auth state cleared');
//   }

//   // Helper methods
//   private getTokenFromCookie(): string | null {
//     try {
//       const cookie = document.cookie
//         .split('; ')
//         .find(row => row.startsWith('access_token='));
      
//       return cookie ? cookie.split('=')[1] : null;
//     } catch (err) {
//       console.error('Cookie parsing failed:', err);
//       return null;
//     }
//   }

//   get currentUser(): User | null {
//     return this.currentUserSubject.value;
//   }

//   isAuthenticated(): boolean {
//     const token = this.getTokenFromCookie();
//     if (!token) return false;
    
//     if (this.isTokenExpired(token)) {
//       this.clearAuthState();
//       return false;
//     }
    
//     return true;
//   }

//   getToken(): string | null {
//     return this.getTokenFromCookie();
//   }

//   getUserProfile(): UserProfile | null {
//     const user = this.currentUser;
//     if (!user) return null;
    
//     return {
//       id: user.id,
//       firstName: user.firstName,
//       email: user.email,
//       role: user.role
//     };
//   }

//   // Role checks
//   hasRole(role: string): boolean {
//     return this.currentUser?.role.toLowerCase() === role.toLowerCase();
//   }

//   isAdmin(): boolean {
//     return this.hasRole('Admin');
//   }

//   isHost(): boolean {
//     return this.hasRole('Host');
//   }

//   isGuest(): boolean {
//     return this.hasRole('Guest');
//   }

//   hasAnyRole(roles: string[]): boolean {
//     const userRole = this.currentUser?.role;
//     return userRole ? roles.some(role => this.hasRole(role)) : false;
//   }

//   getUserFullName(): string {
//     return this.currentUser?.firstName || '';
//   }

// private getUserFromToken(token: string): User {
//   const payload = this.decodeToken(token);
  
//   // Debug the payload to verify structure
//   console.log('[DEBUG] Decoded JWT payload:', payload);

//   return {
//     id: payload.UserID,       // ← Matches JwtPayload.UserID
//     firstName: payload.UserName, // ← Matches JwtPayload.UserName
//     email: payload.Email,      // ← Matches JwtPayload.Email
//     role: payload.Role,        // ← Matches JwtPayload.Role
//     accessToken: token
//   };
// }

// private decodeToken(token: string): JwtPayload {
//   try {
//     const base64Url = token.split('.')[1];
//     const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//     const payload = JSON.parse(atob(base64)) as JwtPayload; // Explicit type casting
    
//     // Validate required claims
//     if (!payload.Email || !payload.UserName || !payload.Role || !payload.UserID) {
//       throw new Error('Missing required token claims');
//     }
    
//     return payload;
//   } catch (error) {
//     console.error('Error decoding JWT payload:', error);
//     throw new Error('Invalid token format');
//   }
// }

//   private isTokenExpired(token: string): boolean {
//     try {
//       const payload = this.decodeToken(token);
//       if (!payload.exp) return false;
      
//       return payload.exp < Math.floor(Date.now() / 1000);
//     } catch (error) {
//       console.error('Error checking token expiration:', error);
//       return true;
//     }
//   }

//   // HTTP utilities
//   private getHttpHeaders(): HttpHeaders {
//     return new HttpHeaders({
//       'Content-Type': 'application/json'
//     });
//   }

//   getAuthHeaders(): HttpHeaders {
//     return new HttpHeaders({
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${this.getToken()}`
//     });
//   }

//   private handleError = (error: HttpErrorResponse): Observable<never> => {
//     let errorMessage = 'An unexpected error occurred';
    
//     if (error.status === 401) {
//       this.clearAuthState();
//       errorMessage = 'Your session has expired. Please log in again.';
//     }
    
//     if (error.error) {
//       errorMessage = typeof error.error === 'string' 
//         ? error.error 
//         : error.error.message || error.error.error || errorMessage;
//     }

//     return throwError(() => new Error(errorMessage));
//   };

//   private fetchHostId(): Observable<number | null> {
//   return this.http.get<{ id: number }>( // Match your actual response format
//     `${this.API_URL}/host/me`, // Use existing endpoint
//     { headers: this.getAuthHeaders() }
//   ).pipe(
//     map(response => response.id), // Adjust based on your actual response
//     catchError(error => {
//       console.error('Failed to fetch host profile:', error);
//       return of(null); // Return null if not found
//     })
//   );
// }
// }