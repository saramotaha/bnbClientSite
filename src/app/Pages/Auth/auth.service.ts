import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { map, catchError, tap, switchMap } from 'rxjs/operators';
import { 
  User, 
  LoginDto, 
  RegisterDto, 
  AuthResponse,
  UserProfile,
  JwtPayload 
} from './user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'https://localhost:7145/api/auth';
  private readonly COOKIE_NAME = 'access_token';
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private hostIdSubject = new BehaviorSubject<number | null>(null);
  public hostId$ = this.hostIdSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initializeAuthState();
    this.initializeHostId();
  }

  // Initialize authentication state from cookie
  private initializeAuthState(): void {
    const token = this.getTokenFromCookie();
    if (token && !this.isTokenExpired(token)) {
      const user = this.getUserFromToken(token);
      if (user) {
        user.accessToken = token;
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      }
    } else {
      this.clearAuthState();
    }
  }


  // Register new user (unchanged)
  register(registerDto: RegisterDto): Observable<RegisterDto> {
    const payload = {
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      email: registerDto.email,
      password: registerDto.password,
      confirmPassword: registerDto.confirmPassword,
      ...(registerDto.phoneNumber && { phoneNumber: registerDto.phoneNumber })
    };

    return this.http.post<RegisterDto>(`${this.API_URL}/register`, payload, {
      headers: this.getHttpHeaders()
    }).pipe(
      tap(response => {
        console.log('Registration successful:', response);
      }),
      catchError(this.handleError)
    );
  }

   // Add this method to get host ID
  getHostId(): number | null {
    return this.hostIdSubject.value;
  }

  private initializeHostId(): void {
    const user = this.currentUser;
    if (user && this.isHost()) {
      this.fetchHostId(user.id).subscribe();
    }
  }

  private fetchHostId(userId: string): Observable<number> {
    return this.http.get<{ hostId: number }>(`/api/hosts/by-user/${userId}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(response => {
        this.hostIdSubject.next(response.hostId);
      }),
      map(response => response.hostId)
    );
  }

  // Update your login method to fetch host ID if user is a host
login(loginDto: LoginDto): Observable<User> {
  return this.http.post<{ message: string }>( // Match your actual response type
    `${this.API_URL}/login`,
    loginDto,
    { 
      withCredentials: true, // Required for cookies
      responseType: 'json'
    }
  ).pipe(
    switchMap(() => {
      // Token comes from cookies, not response body
      const token = this.getTokenFromCookie();
      
      if (!token) {
        throw new Error('Login failed: No token found in cookies');
      }

      const user = this.getUserFromToken(token);
      if (!user) {
        throw new Error('Invalid token format');
      }

      // Update auth state
      this.currentUserSubject.next(user);
      this.isAuthenticatedSubject.next(true);
      
      // Fetch host ID if needed
      if (this.isHost()) {
        this.fetchHostId(user.id).subscribe();
      }

      return of(user);
    }),
    catchError(err => {
      this.clearAuthState();
      return throwError(() => err);
    })
  );
}
// Helper to extract token from cookies
private getTokenFromCookie(): string | null {
  const cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith('access_token='))
    ?.split('=')[1];
  
  return cookieValue ? decodeURIComponent(cookieValue) : null;
}

logout(): Observable<void> {
  return this.http.post<void>(
    `${this.API_URL}/LogOut`, 
    {}, 
    { withCredentials: true }
  ).pipe(
    tap(() => {
      document.cookie = `${this.COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      this.currentUserSubject.next(null);
      this.isAuthenticatedSubject.next(false);
    }),
    catchError(error => {
      this.clearAuthState(); // Ensure cleanup even if API fails
      return throwError(() => error);
    })
  );
}

private clearAuthState(): void {
  // 1. Clear the auth cookie by setting an expired cookie
  document.cookie = `${this.COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;

  // 2. Reset observables
  this.currentUserSubject.next(null);
  this.isAuthenticatedSubject.next(false);
  this.hostIdSubject.next(null);  // Clear host ID

  console.log('Auth state cleared');  // For debugging
}

  // Get current user
  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getTokenFromCookie();
    if (!token) return false;
    
    if (this.isTokenExpired(token)) {
      this.clearAuthState();
      return false;
    }
    
    return true;
  }

  // Get current auth token
  getToken(): string | null {
    return this.getTokenFromCookie();
  }

  // Rest of your methods remain the same (getUserProfile, hasRole, etc.)
  // User Profile for display (unchanged)
getUserProfile(): UserProfile | null {
  const user = this.currentUser;
  if (!user) return null;
  
  return {
    id: user.id,
    firstName: user.firstName,
    email: user.email,
    role: user.role
  };
}

// Role-based access control (unchanged)
hasRole(role: string): boolean {
  return this.currentUser?.role === role;
}

isAdmin(): boolean {
  return this.hasRole('Admin');
}

isHost(): boolean {
  return this.hasRole('Host');
}

isGuest(): boolean {
  return this.hasRole('Guest');
}

// Check if user has any of the provided roles (unchanged)
hasAnyRole(roles: string[]): boolean {
  const userRole = this.currentUser?.role;
  return userRole ? roles.includes(userRole) : false;
}

// Get user's full name (unchanged)
getUserFullName(): string {
  const user = this.currentUser;
  if (!user) return '';
  return user.firstName || '';
}

// JWT token utilities (unchanged)
private getUserFromToken(token: string): User {
  try {
    const payload = this.decodeToken(token);
    return {
      id: payload.nameid,
      firstName: payload.name,
      email: payload.email,
      role: payload.role
    };
  } catch (error) {
    throw new Error('Invalid token format');
  }
}

private decodeToken(token: string): JwtPayload {
  try {
    const payload = token.split('.')[1];
    const decodedPayload = atob(payload);
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error('Error decoding JWT payload:', error);
    throw new Error('Invalid token format');
  }
}

private isTokenExpired(token: string): boolean {
  try {
    const payload = this.decodeToken(token);
    
    if (!payload.exp) {
      return false;
    }
    
    const currentTime = Math.floor(Date.now() / 1000);
    const isExpired = payload.exp < currentTime;
    
    if (isExpired) {
      console.log('Token has expired');
    }
    
    return isExpired;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
}

// Make authenticated API calls (unchanged)
makeAuthenticatedRequest<T>(method: 'GET' | 'POST' | 'PUT' | 'DELETE', url: string, body?: any): Observable<T> {
  const headers = this.getAuthHeaders();
  
  switch (method) {
    case 'GET':
      return this.http.get<T>(url, { headers });
    case 'POST':
      return this.http.post<T>(url, body, { headers });
    case 'PUT':
      return this.http.put<T>(url, body, { headers });
    case 'DELETE':
      return this.http.delete<T>(url, { headers });
    default:
      throw new Error('Unsupported HTTP method');
  }
}

// Error handling (unchanged)
private handleError = (error: HttpErrorResponse): Observable<never> => {
  let errorMessage = 'An unexpected error occurred';
  
  console.error('HTTP Error:', error);
  
  if (error.status === 401) {
    this.clearAuthState();
    errorMessage = 'Your session has expired. Please log in again.';
  }
  
  if (error.error) {
    if (typeof error.error === 'string') {
      errorMessage = error.error;
    } else if (error.error.error) {
      errorMessage = error.error.error;
    } else if (error.error.message) {
      errorMessage = error.error.message;
    }
  } else if (error.message) {
    errorMessage = error.message;
  }

  switch (error.status) {
    case 400:
      if (errorMessage.includes('Enter All Required Data')) {
        errorMessage = 'Please fill in all required fields';
      } else if (errorMessage.includes('Change Email')) {
        errorMessage = 'This email is already registered. Please use a different email or try logging in.';
      } else if (errorMessage.includes('change pass')) {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (errorMessage.includes('Enter Valid email')) {
        errorMessage = 'Please enter a valid email or sign up for a new account.';
      }
      break;
    case 403:
      errorMessage = 'Access denied. You do not have permission to perform this action.';
      break;
    case 404:
      errorMessage = 'Service not found. Please try again later.';
      break;
    case 500:
      errorMessage = 'Server error. Please try again later.';
      break;
    case 0:
      errorMessage = 'Unable to connect to the server. Please check your internet connection.';
      break;
  }

  return throwError(() => new Error(errorMessage));
};

// Refresh token if you implement it later (unchanged)
refreshToken(): Observable<User> {
  return throwError(() => new Error('Refresh token not implemented'));
}

// Check if token is about to expire (unchanged)
isTokenExpiringSoon(minutesBeforeExpiry: number = 5): boolean {
  const token = this.getToken();
  if (!token) return false;

  try {
    const payload = this.decodeToken(token);
    if (!payload.exp) return false;

    const currentTime = Math.floor(Date.now() / 1000);
    const expiryTime = payload.exp;
    const timeUntilExpiry = expiryTime - currentTime;
    const minutesUntilExpiry = timeUntilExpiry / 60;

    return minutesUntilExpiry <= minutesBeforeExpiry;
  } catch (error) {
    return true;
  }
}

  // HTTP headers for API requests
  private getHttpHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  // Get headers with authentication token (for protected API calls)
 // Ensure all authenticated requests include credentials
getAuthHeaders(): HttpHeaders {
  return new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${this.getToken()}`
  }).set('X-Requested-With', 'XMLHttpRequest'); // Helps with some CORS scenarios
}

  // Update fetchAndStoreHostId to not use localStorage
  fetchAndStoreHostId(): void {
    const userId = this.currentUser?.id;
    if (!userId) return;

    this.http.get<{ hostId: number }>(`/api/hosts/by-user/${userId}`, {
      headers: this.getAuthHeaders()
    }).subscribe({
      next: (response) => {
        // Store hostId in memory instead of localStorage
        // You could add it to your User model if needed
      },
      error: (err) => {
        console.warn('Unable to fetch host ID:', err);
      }
    });
  }

}