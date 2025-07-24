// Main User interface
export interface User {
  id: string;
  firstName: string;
  email: string;
  role: string;
  accessToken?: string;
}

// API Request DTOs
export interface RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword?: string;
  phoneNumber?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

// API Response
export interface AuthResponse {
  message: string; //JWT token
}

// User Profile for display
export interface UserProfile {
  id: string;
  firstName: string;
  email: string;
  role: string;
  lastName?: string;
  phoneNumber?: string;
  imageUrl?: string;
}

// JWT Token payload (for decoding the token controller creates)
export interface JwtPayload {
  email: string;
  name: string;        
  nameid: string;     
  role: string;        
  exp?: number;      
}