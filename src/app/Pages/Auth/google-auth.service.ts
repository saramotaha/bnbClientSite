// // // import { Injectable } from '@angular/core';
// // // import { Observable, from, throwError } from 'rxjs';
// // // import { catchError, map } from 'rxjs/operators';
// // // import { environment } from '../../../environments/environment.prod'; 


// // // declare const gapi: any;

// // // export interface GoogleUser {
// // //   email: string;
// // //   firstName: string;
// // //   lastName: string;
// // //   imageUrl: string;
// // //   idToken: string;
// // // }

// // // @Injectable({
// // //   providedIn: 'root'
// // // })
// // // export class GoogleAuthService {
// // //   private auth2: any;
// // //   private readonly CLIENT_ID = environment.googleClientId;

// // //   constructor() {
// // //     this.loadGoogleAPI();
// // //   }

// // //   private async loadGoogleAPI(): Promise<void> {
// // //     return new Promise((resolve, reject) => {
// // //       if (typeof gapi !== 'undefined') {
// // //         this.initializeGapi().then(resolve).catch(reject);
// // //         return;
// // //       }

// // //       const script = document.createElement('script');
// // //       script.src = 'https://apis.google.com/js/platform.js';
// // //       script.async = true;
// // //       script.defer = true;
// // //       script.onload = () => {
// // //         this.initializeGapi().then(resolve).catch(reject);
// // //       };
// // //       script.onerror = reject;
// // //       document.head.appendChild(script);
// // //     });
// // //   }

// // //   private async initializeGapi(): Promise<void> {
// // //     return new Promise((resolve, reject) => {
// // //       gapi.load('auth2', () => {
// // //         gapi.auth2.init({
// // //           client_id: this.CLIENT_ID,
// // //           scope: 'profile email'
// // //         }).then(() => {
// // //           this.auth2 = gapi.auth2.getAuthInstance();
// // //           resolve();
// // //         }).catch(reject);
// // //       });
// // //     });
// // //   }

// // //   signIn(): Observable<GoogleUser> {
// // //     return from(this.auth2.signIn()).pipe(
// // //       map((googleUser: any) => this.extractUserInfo(googleUser)),
// // //       catchError(error => throwError(() => new Error('Google sign-in failed: ' + error.message)))
// // //     );
// // //   }

// // // signOut(): Observable<void> {
// // //   return from(this.auth2.signOut() as Promise<void>).pipe(
// // //     catchError(error => throwError(() => new Error('Google sign-out failed: ' + error.message)))
// // //   );
// // // }

// // //   private extractUserInfo(googleUser: any): GoogleUser {
// // //     const profile = googleUser.getBasicProfile();
// // //     const authResponse = googleUser.getAuthResponse();
    
// // //     return {
// // //       email: profile.getEmail(),
// // //       firstName: profile.getGivenName(),
// // //       lastName: profile.getFamilyName(),
// // //       imageUrl: profile.getImageUrl(),
// // //       idToken: authResponse.id_token
// // //     };
// // //   }
// // // }
// // import { Injectable } from '@angular/core';
// // import { Observable, from, throwError, BehaviorSubject } from 'rxjs';
// // import { catchError, map, switchMap, filter, take } from 'rxjs/operators';

// // declare const gapi: any;

// // export interface GoogleUser {
// //   email: string;
// //   firstName: string;
// //   lastName: string;
// //   imageUrl: string;
// //   idToken: string;
// // }

// // @Injectable({
// //   providedIn: 'root'
// // })
// // export class GoogleAuthService {
// //   private auth2: any;
// //   private readonly CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID'; // Replace with your actual client ID
// //   private isInitialized$ = new BehaviorSubject<boolean>(false);
// //   private initPromise: Promise<void> | null = null;

// //   constructor() {
// //     this.initializeGoogleAuth();
// //   }

// //   private async initializeGoogleAuth(): Promise<void> {
// //     if (this.initPromise) {
// //       return this.initPromise;
// //     }

// //     this.initPromise = this.loadAndInitGoogleAPI();
// //     return this.initPromise;
// //   }

// //   private async loadAndInitGoogleAPI(): Promise<void> {
// //     try {
// //       // Check if gapi is already loaded
// //       if (typeof gapi === 'undefined') {
// //         await this.loadGoogleScript();
// //       }

// //       await this.initializeGapi();
// //       this.isInitialized$.next(true);
// //       console.log('✅ Google Auth initialized successfully');
// //     } catch (error) {
// //       console.error('❌ Failed to initialize Google Auth:', error);
// //       this.isInitialized$.next(false);
// //       throw error;
// //     }
// //   }

// //   private loadGoogleScript(): Promise<void> {
// //     return new Promise((resolve, reject) => {
// //       // Check if script is already loaded
// //       if (document.querySelector('script[src*="apis.google.com"]')) {
// //         resolve();
// //         return;
// //       }

// //       const script = document.createElement('script');
// //       script.src = 'https://apis.google.com/js/api.js';
// //       script.async = true;
// //       script.defer = true;
      
// //       script.onload = () => {
// //         console.log('📦 Google API script loaded');
// //         resolve();
// //       };
      
// //       script.onerror = (error) => {
// //         console.error('❌ Failed to load Google API script:', error);
// //         reject(new Error('Failed to load Google API script'));
// //       };
      
// //       document.head.appendChild(script);
// //     });
// //   }

// //   private async initializeGapi(): Promise<void> {
// //     return new Promise((resolve, reject) => {
// //       gapi.load('auth2', () => {
// //         gapi.auth2.init({
// //           client_id: this.CLIENT_ID,
// //           scope: 'profile email'
// //         }).then(() => {
// //           this.auth2 = gapi.auth2.getAuthInstance();
// //           console.log('🔐 Google Auth2 instance created');
// //           resolve();
// //         }).catch((error: any) => {
// //           console.error('❌ Failed to initialize gapi.auth2:', error);
// //           reject(error);
// //         });
// //       });
// //     });
// //   }

// //   signIn(): Observable<GoogleUser> {
// //     return this.waitForInitialization().pipe(
// //       switchMap(() => {
// //         if (!this.auth2) {
// //           return throwError(() => new Error('Google Auth not properly initialized'));
// //         }

// //         console.log('🚀 Starting Google sign-in...');
// //         return from(this.auth2.signIn({
// //           scope: 'profile email'
// //         }));
// //       }),
// //       map((googleUser: any) => {
// //         console.log('✅ Google sign-in successful');
// //         return this.extractUserInfo(googleUser);
// //       }),
// //       catchError(error => {
// //         console.error('❌ Google sign-in failed:', error);
// //         return throwError(() => new Error('Google sign-in failed: ' + (error.error || error.message || 'Unknown error')));
// //       })
// //     );
// //   }

// // //   signOut(): Observable<void> {
// // //     return this.waitForInitialization().pipe(
// // //       switchMap(() => {
// // //         if (!this.auth2) {
// // //           return throwError(() => new Error('Google Auth not initialized'));
// // //         }
// // //         return from(this.auth2.signOut());
// // //       })
// // //     );
// // //   }

// //   private waitForInitialization(): Observable<boolean> {
// //     return this.isInitialized$.pipe(
// //       filter(initialized => initialized),
// //       take(1),
// //       switchMap(() => {
// //         // Double check that auth2 is actually available
// //         if (!this.auth2) {
// //           return from(this.initializeGoogleAuth()).pipe(
// //             map(() => true)
// //           );
// //         }
// //         return [true];
// //       })
// //     );
// //   }

// //   private extractUserInfo(googleUser: any): GoogleUser {
// //     try {
// //       const profile = googleUser.getBasicProfile();
// //       const authResponse = googleUser.getAuthResponse();
      
// //       const userInfo = {
// //         email: profile.getEmail(),
// //         firstName: profile.getGivenName() || '',
// //         lastName: profile.getFamilyName() || '',
// //         imageUrl: profile.getImageUrl() || '',
// //         idToken: authResponse.id_token
// //       };

// //       console.log('👤 Extracted user info:', { ...userInfo, idToken: 'HIDDEN' });
// //       return userInfo;
// //     } catch (error) {
// //       console.error('❌ Failed to extract user info:', error);
// //       throw new Error('Failed to extract user information from Google response');
// //     }
// //   }

// //   // Method to check if Google Auth is ready
// //   isReady(): Observable<boolean> {
// //     return this.isInitialized$.asObservable();
// //   }

// //   // Method to manually trigger initialization (useful for testing)
// //   async forceInitialize(): Promise<void> {
// //     this.initPromise = null;
// //     this.isInitialized$.next(false);
// //     await this.initializeGoogleAuth();
// //   }
// // }
// /////=========================================================================================================//
// // google-auth.service.ts
// import { Injectable } from '@angular/core';
// import { Observable, from, throwError, BehaviorSubject } from 'rxjs';
// import { catchError, map, switchMap, filter, take } from 'rxjs/operators';

// declare const google: any;

// export interface GoogleUser {
//   email: string;
//   firstName: string;
//   lastName: string;
//   imageUrl: string;
//   idToken: string;
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class GoogleAuthService {
//   private isInitialized$ = new BehaviorSubject<boolean>(false);
//   private readonly CLIENT_ID = '9497120430-alh2k2stssd939m306c6r3mck7tgj3nq.apps.googleusercontent.com'; // 🔥 REPLACE THIS!
//   private initPromise: Promise<void> | null = null;

//   constructor() {
//     this.initializeGoogleAuth();
//   }

//   private async initializeGoogleAuth(): Promise<void> {
//     if (this.initPromise) {
//       return this.initPromise;
//     }

//     this.initPromise = this.loadAndInitGoogleAPI();
//     return this.initPromise;
//   }

//   private async loadAndInitGoogleAPI(): Promise<void> {
//     try {
//       // Load Google Identity Services (New API)
//       await this.loadGoogleScript();
//       await this.initializeGoogleIdentity();
//       this.isInitialized$.next(true);
//       console.log('✅ Google Identity Services initialized successfully');
//     } catch (error) {
//       console.error('❌ Failed to initialize Google Auth:', error);
//       this.isInitialized$.next(false);
//       throw error;
//     }
//   }

//   private loadGoogleScript(): Promise<void> {
//     return new Promise((resolve, reject) => {
//       // Check if script is already loaded
//       if (document.querySelector('script[src*="accounts.google.com/gsi"]')) {
//         resolve();
//         return;
//       }

//       const script = document.createElement('script');
//       script.src = 'https://accounts.google.com/gsi/client';
//       script.async = true;
//       script.defer = true;
      
//       script.onload = () => {
//         console.log('📦 Google Identity Services script loaded');
//         resolve();
//       };
      
//       script.onerror = (error) => {
//         console.error('❌ Failed to load Google Identity Services script:', error);
//         reject(new Error('Failed to load Google Identity Services script'));
//       };
      
//       document.head.appendChild(script);
//     });
//   }

//   private async initializeGoogleIdentity(): Promise<void> {
//     return new Promise((resolve, reject) => {
//       if (typeof google === 'undefined') {
//         reject(new Error('Google Identity Services not loaded'));
//         return;
//       }

//       try {
//         google.accounts.id.initialize({
//           client_id: this.CLIENT_ID,
//           callback: () => {}, // We'll handle this in signIn method
//           auto_select: false,
//           cancel_on_tap_outside: true
//         });
        
//         console.log('🔐 Google Identity Services initialized');
//         resolve();
//       } catch (error) {
//         console.error('❌ Failed to initialize Google Identity Services:', error);
//         reject(error);
//       }
//     });
//   }

//   signIn(): Observable<GoogleUser> {
//     return this.waitForInitialization().pipe(
//       switchMap(() => {
//         if (typeof google === 'undefined') {
//           return throwError(() => new Error('Google Identity Services not available'));
//         }

//         console.log('🚀 Starting Google sign-in...');
        
//         return new Observable<GoogleUser>(observer => {
//           try {
//             google.accounts.oauth2.initTokenClient({
//               client_id: this.CLIENT_ID,
//               scope: 'profile email',
//               callback: (response: any) => {
//                 if (response.error) {
//                   observer.error(new Error(response.error));
//                   return;
//                 }

//                 // Get user info using the access token
//                 this.getUserInfo(response.access_token).then(userInfo => {
//                   observer.next(userInfo);
//                   observer.complete();
//                 }).catch(error => {
//                   observer.error(error);
//                 });
//               }
//             }).requestAccessToken();
//           } catch (error) {
//             observer.error(error);
//           }
//         });
//       }),
//       catchError(error => {
//         console.error('❌ Google sign-in failed:', error);
//         return throwError(() => new Error('Google sign-in failed: ' + (error.message || 'Unknown error')));
//       })
//     );
//   }

//   private async getUserInfo(accessToken: string): Promise<GoogleUser> {
//     try {
//       const response = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`);
//       const userInfo = await response.json();

//       if (!response.ok) {
//         throw new Error(userInfo.error || 'Failed to get user info');
//       }

//       return {
//         email: userInfo.email,
//         firstName: userInfo.given_name || '',
//         lastName: userInfo.family_name || '',
//         imageUrl: userInfo.picture || '',
//         idToken: accessToken // Using access token as ID token for simplicity
//       };
//     } catch (error) {
//       console.error('❌ Failed to get user info:', error);
//       throw new Error('Failed to get user information');
//     }
//   }

//   private waitForInitialization(): Observable<boolean> {
//     return this.isInitialized$.pipe(
//       filter(initialized => initialized),
//       take(1),
//       switchMap(() => {
//         if (typeof google === 'undefined') {
//           return from(this.initializeGoogleAuth()).pipe(
//             map(() => true)
//           );
//         }
//         return [true];
//       })
//     );
//   }

//   isReady(): Observable<boolean> {
//     return this.isInitialized$.asObservable();
//   }

//   async forceInitialize(): Promise<void> {
//     this.initPromise = null;
//     this.isInitialized$.next(false);
//     await this.initializeGoogleAuth();
//   }
// }

// google-auth.service.ts
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
      script.src = 'https://accounts.google.com/gsi/client';
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