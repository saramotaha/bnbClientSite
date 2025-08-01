// // import { Component, OnInit, OnDestroy } from '@angular/core';
// // import { CommonModule } from '@angular/common';
// // import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
// // import { Router } from '@angular/router';
// // import { Subject, takeUntil } from 'rxjs';

// // import { AuthService } from './../Auth/auth.service';
// // import { ValidationService } from './../Auth/validation.service';
// // import { ValidationErrorComponent } from './../Auth/validation-error.component';
// // import { LoginDto } from './../Auth/user.model';

// // @Component({
// //   selector: 'app-login',
// //  standalone: true,
// //   imports: [
// //     CommonModule,
// //     ReactiveFormsModule,
// //   ],
// //   templateUrl: './login.html',
// //   styleUrl: './login.css'
// // })
// // export class Login implements OnInit, OnDestroy {
// //   loginForm!: FormGroup;
// //   showPassword = false;
// //   errorMessage = '';
// //   isLoading = false;

// //   private destroy$ = new Subject<void>();

// //   constructor(
// //     private fb: FormBuilder,
// //     private authService: AuthService,
// //     private router: Router
// //   ) {}

// //   ngOnInit(): void {
// //     this.initializeForm();

// //     // Redirect if already authenticated
// //     if (this.authService.isAuthenticated()) {
// //       this.redirectBasedOnRole();
// //     }

// //     // Clear any existing error message when form values change
// //     this.loginForm.valueChanges
// //       .pipe(takeUntil(this.destroy$))
// //       .subscribe(() => {
// //         if (this.errorMessage) {
// //           this.errorMessage = '';
// //         }
// //       });
// //   }

// //   ngOnDestroy(): void {
// //     this.destroy$.next();
// //     this.destroy$.complete();
// //   }

// //   private initializeForm(): void {
// //     this.loginForm = this.fb.group({
// //       email: ['', [
// //         ValidationService.requiredValidator(),
// //         ValidationService.emailValidator()
// //       ]],
// //       password: ['', [
// //         ValidationService.requiredValidator()
// //       ]]
// //     });
// //   }

// //   togglePasswordVisibility(): void {
// //     this.showPassword = !this.showPassword;
// //   }

// //  onSubmit(): void {
// //   if (this.loginForm.valid && !this.isLoading) {
// //     this.isLoading = true;
// //     this.errorMessage = '';

// //     this.authService.login({
// //   email: this.loginForm.get('email')?.value?.trim(),
// //   password: this.loginForm.get('password')?.value
// // }).subscribe({
// //   next: () => this.redirectBasedOnRole(), // ✅ استدعاء التوجيه بناءً على الدور
// //   error: (error) => {
// //     this.errorMessage = this.getFriendlyError(error);
// //     this.isLoading = false;
// //   }
// // });

// //   }
// // }

// // private getFriendlyError(error: any): string {
// //   if (error.status === 401) return 'Invalid email or password';
// //   if (error.status === 0) return 'Network error - please check connection';
// //   return error.message || 'Login failed. Please try again.';
// // }

// //   private markFormGroupTouched(): void {
// //     Object.keys(this.loginForm.controls).forEach(key => {
// //       const control = this.loginForm.get(key);
// //       control?.markAsTouched();
// //     });
// //   }

// //   private redirectBasedOnRole(): void {
// //     const user = this.authService.getUserProfile();

// //     if (!user) {
// //       this.router.navigate(['/']);
// //       return;
// //     }

// //     // Redirect based on user role
// //     switch (user.role.toLowerCase()) {
// //       case 'admin':
// //         this.router.navigate(['/admin']);
// //         break;
// //       // case 'host':
// //       //   this.router.navigate(['/host/dashboard']);
// //       //   break;
// //       case 'guest':
// //         this.router.navigate(['/Home']);
// //         break;
// //       default:
// //         this.router.navigate(['/Home']);
// //         break;
// //     }
// //   }

// //   goToRegister(): void {
// //     this.router.navigate(['/register']);
// //   }

// //   goToForgotPassword(): void {
// //     this.router.navigate(['/forgot-password']);
// //   }

// //   // Helper methods for template
// //   isFieldInvalid(fieldName: string): boolean {
// //     const field = this.loginForm.get(fieldName);
// //     return !!(field && field.invalid && (field.dirty || field.touched));
// //   }

// //   getFieldErrors(fieldName: string) {
// //     const field = this.loginForm.get(fieldName);
// //     return field?.errors || null;
// //   }

// // }
// ////////===============================================================================================================////
// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { Router } from '@angular/router';
// import { Subject, takeUntil } from 'rxjs';

// import { AuthService } from './../Auth/auth.service';
// import { ValidationService } from './../Auth/validation.service';
// import { ValidationErrorComponent } from './../Auth/validation-error.component';
// import { LoginDto } from './../Auth/user.model';
// import { GoogleAuthService, GoogleUser } from '../Auth/google-auth.service';
// import { User } from './../Auth/user.model';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [
//     CommonModule,
//     ReactiveFormsModule,
//     ValidationErrorComponent
//   ],
//   templateUrl: './login.html',
//   styleUrl: './login.css'
// })
// export class Login implements OnInit, OnDestroy {
//   loginForm!: FormGroup;
//   showPassword = false;
//   errorMessage = '';
//   isLoading = false;

//   private destroy$ = new Subject<void>();

//   constructor(
//     private fb: FormBuilder,
//     private authService: AuthService,
//         private googleAuthService: GoogleAuthService,

//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     this.initializeForm();

//     if (this.authService.isAuthenticated()) {
//       this.redirectBasedOnRole();
//     }

//     this.loginForm.valueChanges
//       .pipe(takeUntil(this.destroy$))
//       .subscribe(() => {
//         if (this.errorMessage) {
//           this.errorMessage = '';
//         }
//       });
//   }

//   ngOnDestroy(): void {
//     this.destroy$.next();
//     this.destroy$.complete();
//   }

//   private initializeForm(): void {
//     this.loginForm = this.fb.group({
//       email: ['', [
//         ValidationService.requiredValidator(),
//         ValidationService.emailValidator()
//       ]],
//       password: ['', [
//         ValidationService.requiredValidator()
//       ]]
//     });
//   }

//   togglePasswordVisibility(): void {
//     this.showPassword = !this.showPassword;
//   }

//   onSubmit(): void {
//     if (this.loginForm.valid && !this.isLoading) {
//       this.isLoading = true;
//       this.errorMessage = '';

//       const loginDto: LoginDto = {
//         email: this.loginForm.get('email')?.value?.trim(),
//         password: this.loginForm.get('password')?.value
//       };

//       this.authService.login(loginDto).subscribe({
//         next: () => this.redirectBasedOnRole(),
//         error: (error) => {
//           this.errorMessage = this.getFriendlyError(error);
//           this.isLoading = false;
//         }
//       });
//     } else {
//       this.markFormGroupTouched();
//     }
//   }

//    // Google Sign-In Method
//   signInWithGoogle(): void {
//     if (this.isLoading) return;
    
//     this.isLoading = true;
//     this.errorMessage = '';

//     this.googleAuthService.signIn()
//       .pipe(takeUntil(this.destroy$))
//       .subscribe({
//         next: (googleUser: GoogleUser) => {
//           console.log('Google user info:', googleUser);
          
//           // Authenticate with your backend
//           this.authService.googleAuth(googleUser).subscribe({
//             next: () => {
//               this.isLoading = false;
//               this.redirectBasedOnRole();
//             },
//             error: (error) => {
//               this.isLoading = false;
//               this.errorMessage = this.getFriendlyError(error);
//             }
//           });
//         },
//         error: (error) => {
//           this.isLoading = false;
//           this.errorMessage = 'Google sign-in failed. Please try again.';
//           console.error('Google sign-in error:', error);
//         }
//       });
//   }

//   private getFriendlyError(error: any): string {
//     if (error.status === 401) return 'Invalid email or password';
//     if (error.status === 0) return 'Network error - please check your connection';
//     return error.message || 'Login failed. Please try again.';
//   }

//   private markFormGroupTouched(): void {
//     Object.keys(this.loginForm.controls).forEach(key => {
//       const control = this.loginForm.get(key);
//       control?.markAsTouched();
//     });
//   }

// private redirectBasedOnRole(): void {
//   const user = this.authService.getUserProfile();

//   if (!user || !user.role || user.role.length === 0) {
//     this.router.navigate(['/']);
//     return;
//   }

//   // Normalize roles to lowercase for comparison
//   const roles = user.role.map(r => r.toLowerCase());

//   if (roles.includes('admin')) {
//     this.router.navigate(['/admin']);
//   } else if (roles.includes('host')) {
//     this.router.navigate(['/host/dashboard']);
//   } else if (roles.includes('guest')) {
//     this.router.navigate(['/home']);
//   } else {
//     this.router.navigate(['/home']);
//   }
// }


//   goToRegister(): void {
//     this.router.navigate(['/register']);
//   }

//   goToForgotPassword(): void {
//     this.router.navigate(['/forgot-password']);
//   }

//   isFieldInvalid(fieldName: string): boolean {
//     const field = this.loginForm.get(fieldName);
//     return !!(field && field.invalid && (field.dirty || field.touched));
//   }

//   getFieldErrors(fieldName: string) {
//     const field = this.loginForm.get(fieldName);
//     return field?.errors || null;
//   }


// }
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil, timer } from 'rxjs';

import { AuthService } from './../Auth/auth.service';
import { GoogleAuthService, GoogleUser } from '../Auth/google-auth.service';
import { ValidationService } from './../Auth/validation.service';
import { ValidationErrorComponent } from './../Auth/validation-error.component';
import { LoginDto } from './../Auth/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ValidationErrorComponent
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  showPassword = false;
  errorMessage = '';
  isLoading = false;
  isGoogleLoading = false;
  isGoogleReady = false;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private googleAuthService: GoogleAuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();

    if (this.authService.isAuthenticated()) {
      this.redirectBasedOnRole();
    }

    this.loginForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.errorMessage) {
          this.errorMessage = '';
        }
      });

    // Check Google Auth readiness
    this.checkGoogleAuthStatus();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [
        ValidationService.requiredValidator(),
        ValidationService.emailValidator()
      ]],
      password: ['', [
        ValidationService.requiredValidator()
      ]]
    });
  }

  private checkGoogleAuthStatus(): void {
    // Check if Google Auth is ready
    this.googleAuthService.isReady()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (isReady) => {
          this.isGoogleReady = isReady;
          console.log('Google Auth Ready:', isReady);
        },
        error: (error) => {
          console.error('Google Auth Status Error:', error);
          this.isGoogleReady = false;
        }
      });

    // Fallback: Try to initialize after a delay
    timer(2000).pipe(takeUntil(this.destroy$)).subscribe(() => {
      if (!this.isGoogleReady) {
        console.log('🔄 Attempting to force initialize Google Auth...');
        this.googleAuthService.forceInitialize().catch(error => {
          console.error('Failed to force initialize Google Auth:', error);
        });
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.errorMessage = '';

      const loginDto: LoginDto = {
        email: this.loginForm.get('email')?.value?.trim(),
        password: this.loginForm.get('password')?.value
      };

      this.authService.login(loginDto).subscribe({
        next: () => {
          this.isLoading = false;
          this.redirectBasedOnRole();
        },
        error: (error) => {
          this.errorMessage = this.getFriendlyError(error);
          this.isLoading = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  // Enhanced Google Sign-In Method
  signInWithGoogle(): void {
    if (this.isGoogleLoading || this.isLoading) {
      console.log('⏳ Authentication already in progress...');
      return;
    }

    if (!this.isGoogleReady) {
      this.errorMessage = 'Google Sign-In is not ready yet. Please wait a moment and try again.';
      console.error('❌ Google Auth not ready');
      
      // Try to reinitialize
      this.googleAuthService.forceInitialize().then(() => {
        console.log('✅ Google Auth reinitialized, try again');
        this.errorMessage = 'Google Sign-In is now ready. Please try again.';
      }).catch(error => {
        console.error('❌ Failed to reinitialize Google Auth:', error);
        this.errorMessage = 'Google Sign-In is currently unavailable. Please use email/password login.';
      });
      return;
    }
    
    this.isGoogleLoading = true;
    this.errorMessage = '';
    console.log('🚀 Starting Google Sign-In process...');

    this.googleAuthService.signIn()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (googleUser: GoogleUser) => {
          console.log('✅ Google user info received:', { ...googleUser, idToken: 'HIDDEN' });
          
          // Authenticate with your backend
          this.authService.googleAuth(googleUser).subscribe({
            next: (user) => {
              console.log('✅ Backend authentication successful:', user);
              this.isGoogleLoading = false;
              this.redirectBasedOnRole();
            },
            error: (error) => {
              console.error('❌ Backend authentication failed:', error);
              this.isGoogleLoading = false;
              this.errorMessage = this.getFriendlyError(error);
            }
          });
        },
        error: (error) => {
          console.error('❌ Google sign-in failed:', error);
          this.isGoogleLoading = false;
          
          // Provide specific error messages
          if (error.message.includes('popup_closed_by_user')) {
            this.errorMessage = 'Sign-in was cancelled. Please try again.';
          } else if (error.message.includes('access_denied')) {
            this.errorMessage = 'Access denied. Please grant permission to continue.';
          } else if (error.message.includes('network')) {
            this.errorMessage = 'Network error. Please check your connection and try again.';
          } else {
            this.errorMessage = 'Google Sign-In failed. Please try again or use email/password login.';
          }
        }
      });
  }

  private getFriendlyError(error: any): string {
    if (error.status === 401) return 'Invalid email or password';
    if (error.status === 0) return 'Network error - please check your connection';
    if (error.status === 400 && error.error?.message) return error.error.message;
    return error.message || 'Login failed. Please try again.';
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  private redirectBasedOnRole(): void {
    const user = this.authService.getUserProfile();

    if (!user || !user.role || user.role.length === 0) {
      this.router.navigate(['/']);
      return;
    }

    const roles = user.role.map(r => r.toLowerCase());

    if (roles.includes('admin')) {
      this.router.navigate(['/admin']);
    } else if (roles.includes('host')) {
      this.router.navigate(['/host/dashboard']);
    } else if (roles.includes('guest')) {
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/home']);
    }
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  goToForgotPassword(): void {
    this.router.navigate(['/forgot-password']);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldErrors(fieldName: string) {
    const field = this.loginForm.get(fieldName);
    return field?.errors || null;
  }

  // Getter for template to check if any loading is happening
  get isAnyLoading(): boolean {
    return this.isLoading || this.isGoogleLoading;
  }
}