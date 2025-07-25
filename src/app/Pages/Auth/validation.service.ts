import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  // Text input validation with character length constraints
  static textValidator(minLength: number = 2, maxLength: number = 50): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value || control.value.trim() === '') {
        return { required: true };
      }
      
      const value = control.value.trim();
      
      if (value.length < minLength) {
        return { minlength: { requiredLength: minLength, actualLength: value.length } };
      }
      
      if (value.length > maxLength) {
        return { maxlength: { requiredLength: maxLength, actualLength: value.length } };
      }
      
      // Only allow letters, spaces, hyphens, and apostrophes
      const namePattern = /^[a-zA-Z\s\-']+$/;
      if (!namePattern.test(value)) {
        return { pattern: { message: 'Only letters, spaces, hyphens, and apostrophes are allowed' } };
      }
      
      return null;
    };
  }

  // Email validation with standard pattern
  static emailValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value || control.value.trim() === '') {
        return { required: true };
      }

      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      
      if (!emailPattern.test(control.value.trim())) {
        return { email: { message: 'Please enter a valid email address' } };
      }

      return null;
    };
  }

  // Phone number validation with flexible format support
  static phoneValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value || control.value.trim() === '') {
        return null; // Phone is optional
      }

      const phoneValue = control.value.replace(/\s/g, ''); // Remove spaces
      
      // Support multiple formats:
      // +1234567890, 1234567890, (123) 456-7890, 123-456-7890, 123.456.7890
      const phonePatterns = [
        /^\+?1?[2-9]\d{2}[2-9]\d{2}\d{4}$/, // +1234567890 or 1234567890
        /^\(\d{3}\)\s?\d{3}-?\d{4}$/, // (123) 456-7890 or (123)456-7890
        /^\d{3}[-.\s]?\d{3}[-.\s]?\d{4}$/, // 123-456-7890 or 123.456.7890
        /^\+\d{1,3}\d{4,14}$/ // International format
      ];

      const isValid = phonePatterns.some(pattern => pattern.test(phoneValue));
      
      if (!isValid) {
        return { 
          phone: { 
            message: 'Please enter a valid phone number (e.g., +1234567890, (123) 456-7890, or 123-456-7890)' 
          } 
        };
      }

      return null;
    };
  }

  // Strong password validation
  static strongPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value || control.value.trim() === '') {
        return { required: true };
      }

      const password = control.value;
      const errors: any = {};

      // At least 8 characters
      if (password.length < 8) {
        errors.minLength = 'Password must be at least 8 characters long';
      }

      // Contains uppercase letter
      if (!/[A-Z]/.test(password)) {
        errors.uppercase = 'Password must contain at least one uppercase letter';
      }

      // Contains lowercase letter
      if (!/[a-z]/.test(password)) {
        errors.lowercase = 'Password must contain at least one lowercase letter';
      }

      // Contains number
      if (!/\d/.test(password)) {
        errors.number = 'Password must contain at least one number';
      }

      // Contains special character
      if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        errors.special = 'Password must contain at least one special character';
      }

      return Object.keys(errors).length > 0 ? { strongPassword: errors } : null;
    };
  }

  // Password match validator (for form group)
  static passwordMatchValidator(passwordField: string = 'password', confirmPasswordField: string = 'confirmPassword'): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      if (!(formGroup instanceof FormGroup)) {
        return null;
      }

      const password = formGroup.get(passwordField);
      const confirmPassword = formGroup.get(confirmPasswordField);

      if (!password || !confirmPassword) {
        return null;
      }

      if (password.value !== confirmPassword.value) {
        confirmPassword.setErrors({ ...confirmPassword.errors, passwordMismatch: true });
        return { passwordMismatch: true };
      } else {
        // Remove passwordMismatch error if passwords match
        if (confirmPassword.errors?.['passwordMismatch']) {
          delete confirmPassword.errors['passwordMismatch'];
          if (Object.keys(confirmPassword.errors).length === 0) {
            confirmPassword.setErrors(null);
          }
        }
      }

      return null;
    };
  }

  // Generic required validator that handles empty/whitespace values
  static requiredValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value || control.value.toString().trim() === '') {
        return { required: true };
      }
      return null;
    };
  }

  // Get error message for display
  static getErrorMessage(errors: ValidationErrors | null, fieldName: string): string {
    if (!errors) return '';

    if (errors['required']) {
      return `${fieldName} is required`;
    }

    if (errors['email']) {
      return errors['email'].message || `Please enter a valid email address`;
    }

    if (errors['phone']) {
      return errors['phone'].message || `Please enter a valid phone number`;
    }

    if (errors['minlength']) {
      return `${fieldName} must be at least ${errors['minlength'].requiredLength} characters long`;
    }

    if (errors['maxlength']) {
      return `${fieldName} cannot exceed ${errors['maxlength'].requiredLength} characters`;
    }

    if (errors['pattern']) {
      return errors['pattern'].message || `${fieldName} contains invalid characters`;
    }

    if (errors['strongPassword']) {
      const passwordErrors = errors['strongPassword'];
      const messages = [];
      
      if (passwordErrors.minLength) messages.push(passwordErrors.minLength);
      if (passwordErrors.uppercase) messages.push(passwordErrors.uppercase);
      if (passwordErrors.lowercase) messages.push(passwordErrors.lowercase);
      if (passwordErrors.number) messages.push(passwordErrors.number);
      if (passwordErrors.special) messages.push(passwordErrors.special);
      
      return messages.join('. ');
    }

    if (errors['passwordMismatch']) {
      return 'Passwords do not match';
    }

    return `${fieldName} is invalid`;
  }
}