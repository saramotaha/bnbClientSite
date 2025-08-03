import { Injectable } from '@angular/core';
import { Observable, from, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map, switchMap, filter, take } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

declare const google: any;

export interface GoogleUser {
  email: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
  idToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class GoogleAuthService {
  private isInitialized$ = new BehaviorSubject<boolean>(false);
  private readonly CLIENT_ID = environment.googleClientId;
  private initPromise: Promise<void> | null = null;

  constructor() {
    this.initializeGoogleAuth();
  }

  private async initializeGoogleAuth(): Promise<void> {
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = this.loadAndInitGoogleAPI();
    return this.initPromise;
  }

  private async loadAndInitGoogleAPI(): Promise<void> {
    try {
      // Load Google Identity Services (New API)
      await this.loadGoogleScript();
      await this.initializeGoogleIdentity();
      this.isInitialized$.next(true);
      console.log('✅ Google Identity Services initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Google Auth:', error);
      this.isInitialized$.next(false);
      throw error;
    }
  }

  private loadGoogleScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if script is already loaded
      if (document.querySelector('script[src*="accounts.google.com/gsi"]')) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'http://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        console.log('📦 Google Identity Services script loaded');
        resolve();
      };
      
      script.onerror = (error) => {
        console.error('❌ Failed to load Google Identity Services script:', error);
        reject(new Error('Failed to load Google Identity Services script'));
      };
      
      document.head.appendChild(script);
    });
  }

  private async initializeGoogleIdentity(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof google === 'undefined') {
        reject(new Error('Google Identity Services not loaded'));
        return;
      }

      try {
        google.accounts.id.initialize({
          client_id: this.CLIENT_ID,
          callback: () => {}, // We'll handle this in signIn method
          auto_select: false,
          cancel_on_tap_outside: true
        });
        
        console.log('🔐 Google Identity Services initialized');
        resolve();
      } catch (error) {
        console.error('❌ Failed to initialize Google Identity Services:', error);
        reject(error);
      }
    });
  }

  signIn(): Observable<GoogleUser> {
    return this.waitForInitialization().pipe(
      switchMap(() => {
        if (typeof google === 'undefined') {
          return throwError(() => new Error('Google Identity Services not available'));
        }

        console.log('🚀 Starting Google sign-in...');
        
        return new Observable<GoogleUser>(observer => {
          try {
            google.accounts.oauth2.initTokenClient({
              client_id: this.CLIENT_ID,
              scope: 'profile email',
              callback: (response: any) => {
                if (response.error) {
                  observer.error(new Error(response.error));
                  return;
                }

                // Get user info using the access token
                this.getUserInfo(response.access_token).then(userInfo => {
                  observer.next(userInfo);
                  observer.complete();
                }).catch(error => {
                  observer.error(error);
                });
              }
            }).requestAccessToken();
          } catch (error) {
            observer.error(error);
          }
        });
      }),
      catchError(error => {
        console.error('❌ Google sign-in failed:', error);
        return throwError(() => new Error('Google sign-in failed: ' + (error.message || 'Unknown error')));
      })
    );
  }

  private async getUserInfo(accessToken: string): Promise<GoogleUser> {
    try {
      const response = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`);
      const userInfo = await response.json();

      if (!response.ok) {
        throw new Error(userInfo.error || 'Failed to get user info');
      }

      return {
        email: userInfo.email,
        firstName: userInfo.given_name || '',
        lastName: userInfo.family_name || '',
        imageUrl: userInfo.picture || '',
        idToken: accessToken // Using access token as ID token for simplicity
      };
    } catch (error) {
      console.error('❌ Failed to get user info:', error);
      throw new Error('Failed to get user information');
    }
  }

  private waitForInitialization(): Observable<boolean> {
    return this.isInitialized$.pipe(
      filter(initialized => initialized),
      take(1),
      switchMap(() => {
        if (typeof google === 'undefined') {
          return from(this.initializeGoogleAuth()).pipe(
            map(() => true)
          );
        }
        return [true];
      })
    );
  }

  isReady(): Observable<boolean> {
    return this.isInitialized$.asObservable();
  }

  async forceInitialize(): Promise<void> {
    this.initPromise = null;
    this.isInitialized$.next(false);
    await this.initializeGoogleAuth();
  }
}