import { Injectable } from "@angular/core";
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  Email: string;
  UserName: string;
  Role: string;
  UserID: string;
  exp?: number; // optional expiry
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'token';

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getDecodedToken(): JwtPayload | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      return jwtDecode<JwtPayload>(token);
    } catch (err) {
      console.error('Token decode error:', err);
      return null;
    }
  }

  getCurrentUserId(): string | null {
    return this.getDecodedToken()?.UserID ?? null;
  }

  getUserRole(): string | null {
    return this.getDecodedToken()?.Role ?? null;
  }

  getUserEmail(): string | null {
    return this.getDecodedToken()?.Email ?? null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
  }
}
