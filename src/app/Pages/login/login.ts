import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { AuthService } from './../Auth/auth.service';
import { ValidationService } from './../Auth/validation.service';
import { ValidationErrorComponent } from './../Auth/validation-error.component';
import { LoginDto } from './../Auth/user.model';

@Component({
  selector: 'app-login',
 standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  showPassword = false;
  errorMessage = '';
  isLoading = false;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();

    // Redirect if already authenticated
    if (this.authService.isAuthenticated()) {
      this.redirectBasedOnRole();
    }

    // Clear any existing error message when form values change
    this.loginForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.errorMessage) {
          this.errorMessage = '';
        }
      });
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

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

 onSubmit(): void {
  if (this.loginForm.valid && !this.isLoading) {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login({
  email: this.loginForm.get('email')?.value?.trim(),
  password: this.loginForm.get('password')?.value
}).subscribe({
  next: () => this.redirectBasedOnRole(), // ✅ استدعاء التوجيه بناءً على الدور
  error: (error) => {
    this.errorMessage = this.getFriendlyError(error);
    this.isLoading = false;
  }
});

  }
}

private getFriendlyError(error: any): string {
  if (error.status === 401) return 'Invalid email or password';
  if (error.status === 0) return 'Network error - please check connection';
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

    if (!user) {
      this.router.navigate(['/']);
      return;
    }

    // Redirect based on user role
    switch (user.role.toLowerCase()) {
      case 'admin':
        this.router.navigate(['/admin']);
        break;
      // case 'host':
      //   this.router.navigate(['/host/dashboard']);
      //   break;
      case 'guest':
        this.router.navigate(['/Home']);
        break;
      default:
        this.router.navigate(['/Home']);
        break;
    }
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  goToForgotPassword(): void {
    this.router.navigate(['/forgot-password']);
  }

  // Helper methods for template
  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldErrors(fieldName: string) {
    const field = this.loginForm.get(fieldName);
    return field?.errors || null;
  }

}
