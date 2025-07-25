// src/app/components/register/register.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from './../Auth/auth.service';
import { ValidationService } from './../Auth/validation.service';
import { RegisterDto } from './../Auth/user.model';

import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ValidationErrorComponent } from './../Auth/validation-error.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ValidationErrorComponent],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register implements OnInit, OnDestroy {
  registerForm: FormGroup;
  showPassword = false;
  isLoading = false;
  errorMessage = '';

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.createRegisterForm();
  }

  ngOnInit(): void {
    // Check if user is already authenticated
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']); // or wherever you want to redirect
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createRegisterForm(): FormGroup {
    return this.fb.group({
      firstName: ['', [
        ValidationService.requiredValidator(),
        ValidationService.textValidator(2, 50)
      ]],
      lastName: ['', [
        ValidationService.requiredValidator(),
        ValidationService.textValidator(2, 50)
      ]],
      email: ['', [
        ValidationService.requiredValidator(),
        ValidationService.emailValidator()
      ]],
      phoneNumber: ['', [
        ValidationService.phoneValidator() // Optional field
      ]],
      password: ['', [
        ValidationService.requiredValidator(),
        ValidationService.strongPasswordValidator()
      ]],
      confirmPassword: ['', [
        ValidationService.requiredValidator()
      ]]
    }, {
      validators: ValidationService.passwordMatchValidator('password', 'confirmPassword')
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched(this.registerForm);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Create RegisterDto from form values
    const registerDto: RegisterDto = {
      firstName: this.registerForm.value.firstName.trim(),
      lastName: this.registerForm.value.lastName.trim(),
      email: this.registerForm.value.email.trim().toLowerCase(),
      password: this.registerForm.value.password,
      confirmPassword: this.registerForm.value.confirmPassword
    };

    // Add phone number if provided
    if (this.registerForm.value.phoneNumber?.trim()) {
      registerDto.phoneNumber = this.registerForm.value.phoneNumber.trim();
    }

    this.authService.register(registerDto)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          console.log('Registration successful:', response);
          
          // Show success message or redirect to login
          this.router.navigate(['/login'], {
            queryParams: { message: 'Registration successful! Please log in.' }
          });
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = this.getErrorMessage(error);
          console.error('Registration error:', error);
        }
      });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  // Helper method to mark all form controls as touched
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Extract meaningful error message from API response
  private getErrorMessage(error: any): string {
    if (error?.message) {
      return error.message;
    }

    if (error?.error) {
      if (typeof error.error === 'string') {
        return error.error;
      }
      if (error.error.error) {
        return error.error.error;
      }
      if (error.error.message) {
        return error.error.message;
      }
    }

    // Handle specific validation errors from your controller
    if (error?.status === 400) {
      return 'Please check your information and try again.';
    }

    return 'An unexpected error occurred. Please try again.';
  }

  // Getter methods for template convenience
  get firstName() { return this.registerForm.get('firstName'); }
  get lastName() { return this.registerForm.get('lastName'); }
  get email() { return this.registerForm.get('email'); }
  get phoneNumber() { return this.registerForm.get('phoneNumber'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }

  // Validation state helpers for template
  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  isFieldValid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field?.valid && field?.touched);
  }

  getFieldErrors(fieldName: string): ValidationErrors | null {
    return this.registerForm.get(fieldName)?.errors || null;
  }

  // Check if form has password mismatch error
  get hasPasswordMismatchError(): boolean {
    return !!(this.registerForm.errors?.['passwordMismatch'] && this.confirmPassword?.touched);
  }
}