// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
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
  private readonly API_URL = 'https://localhost:7145/api/auth'; //you need to make this in shared place , you could make the base url shared or create a file with all the routes
  private readonly TOKEN_KEY = 'auth_token';
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initializeAuthState();
  }

  // Initialize authentication state from stored token
  private initializeAuthState(): void {
    const token = this.getStoredToken();
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

  // Register new user
  register(registerDto: RegisterDto): Observable<RegisterDto> {
    // Create payload matching your controller expectations
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

  // Login user 
  login(loginDto: LoginDto): Observable<User> {
    const payload = {
      email: loginDto.email,
      password: loginDto.password
    };

    return this.http.post<AuthResponse>(`${this.API_URL}/login`, payload, {
      headers: this.getHttpHeaders()
    }).pipe(
      map(response => {
        // Your controller returns token in response.message
        const token = response.message;
        
        if (!token) {
          throw new Error('No token received from server');
        }

        // Store token
        this.setToken(token);
        
        // Extract user info from JWT token
        const user = this.getUserFromToken(token);
        if (!user) {
          throw new Error('Invalid token received');
        }

        // Set access token
        user.accessToken = token;
        
        // Update state
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
        this.fetchAndStoreHostId(); 
        return user;
      }),
      catchError(this.handleError)
    );
  }

  // Logout user
  logout(): void {
    this.clearAuthState();
  }

  // Get current user
  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getStoredToken();
    if (!token) return false;
    
    if (this.isTokenExpired(token)) {
      this.clearAuthState();
      return false;
    }
    
    return true;
  }

  // Get current auth token
  getToken(): string | null {
    return this.getStoredToken();
  }

  // Get user profile for display
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

  // Role-based access control
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

  // Check if user has any of the provided roles
  hasAnyRole(roles: string[]): boolean {
    const userRole = this.currentUser?.role;
    return userRole ? roles.includes(userRole) : false;
  }

  // Get user's full name
  getUserFullName(): string {
    const user = this.currentUser;
    if (!user) return '';
    return user.firstName || '';
  }

  // Token management methods
  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private getStoredToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  private clearAuthState(): void {
    this.removeToken();
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  // JWT token utilities
  private getUserFromToken(token: string): User | null {
    try {
      const payload = this.decodeToken(token);
      
      // Map JWT claims to User interface based on your controller's token creation
      return {
        id: payload.nameid, // ClaimTypes.NameIdentifier maps to 'nameid'
        firstName: payload.name, // ClaimTypes.Name maps to 'name' 
        email: payload.email, // ClaimTypes.Email maps to 'email'
        role: payload.role // ClaimTypes.Role maps to 'role'
      };
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
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
        // If no expiration claim, consider token as valid
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

  // HTTP headers for API requests
  private getHttpHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  // Get headers with authentication token (for protected API calls)
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  // Make authenticated API calls (helper method)
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

  // Error handling
  private handleError = (error: HttpErrorResponse): Observable<never> => {
    let errorMessage = 'An unexpected error occurred';
    
    console.error('HTTP Error:', error);
    
    // Handle 401 errors (token expired/invalid)
    if (error.status === 401) {
      this.clearAuthState();
      errorMessage = 'Your session has expired. Please log in again.';
    }
    
    if (error.error) {
      // Handle your controller's error responses
      if (typeof error.error === 'string') {
        errorMessage = error.error;
      } else if (error.error.error) {
        // Your controller returns { error: "message" }
        errorMessage = error.error.error;
      } else if (error.error.message) {
        errorMessage = error.error.message;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }

    // Handle specific HTTP status codes
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

  // Refresh token if you implement it later
  refreshToken(): Observable<User> {
    // Placeholder for future refresh token implementation
    return throwError(() => new Error('Refresh token not implemented'));
  }

  // Check if token is about to expire (useful for auto-refresh)
  isTokenExpiringSoon(minutesBeforeExpiry: number = 5): boolean {
    const token = this.getStoredToken();
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
  // Fetch and store host ID in local storage
  fetchAndStoreHostId(): void {
  const userId = this.currentUser?.id;
  if (!userId) return;

  this.http.get<{ hostId: number }>(`/api/hosts/by-user/${userId}`).subscribe({
    next: (response) => {
      localStorage.setItem('hostId', String(response.hostId));
    },
    error: (err) => {
      console.warn('Unable to fetch host ID:', err);
    }
  });
}
getHostId(): string | null {
  return localStorage.getItem('hostId');
}

}