// src/app/components/validation-error/validation-error.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValidationErrors } from '@angular/forms';
import { ValidationService } from '../../Pages/Auth/validation.service';
@Component({
  selector: 'app-validation-error',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="validation-error" *ngIf="errorMessage">
      <i class="fa fa-exclamation-circle"></i>
      {{ errorMessage }}
    </div>
  `,
  styles: [`
    .validation-error {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 5px;
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .validation-error i {
      font-size: 0.8rem;
    }
  `]
})
export class ValidationErrorComponent {
  @Input() errors: ValidationErrors | null = null;
  @Input() fieldName: string = '';

  get errorMessage(): string {
    return ValidationService.getErrorMessage(this.errors, this.fieldName);
  }
}