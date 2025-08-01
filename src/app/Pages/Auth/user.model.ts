// Main User interface
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string[];
  HostId?: string;
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
  HostId?: string;
  name: string;            // username (GUID في حالتك)
  UserID?: string;         // موجود أحياناً
  nameidentifier?: string; // نفس UserId أحياناً
  role?: string;
  exp?: number;
  firstName: string;
  lastName?: string;
}
// google auth related interfaces and services
export interface GoogleAuthRequest {
  email: string;
  firstName: string;
  lastName: string;
  idToken?: string;
}

export interface GoogleLoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    refreshToken?: string;
    user: {
      id: string;
      email: string;
      username: string;
      roles: string[];
    };
    roles: string[];
  };
}

