// // add-verifications.component.ts

// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { Router } from '@angular/router';
// import { HttpClientModule } from '@angular/common/http';
// import { 
//   HostVerificationService 
// } from '../host-verification.service';
// import { 
//   TypeOfVerification, 
//   HostVerificationRequest 
// } from '../host-verification.model';

// interface FilePreview {
//   file: File;
//   url: string;
// }

// @Component({
//   selector: 'app-add-verifications',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
//   templateUrl: './add-verifications.html',
//   styleUrls: ['./add-verifications.css']
// })
// export class AddVerificationsComponent implements OnInit {
//   verificationForm!: FormGroup;
//   isSubmitting = false;
//   error: string | null = null;
//   success = false;
  
//   documentPreview1: FilePreview | null = null;
//   documentPreview2: FilePreview | null = null;
  
//   verificationTypes = [
//     { value: TypeOfVerification.GOVERNMENT_ID, label: 'Government ID', icon: '🪪' },
//     { value: TypeOfVerification.DRIVING_LICENSE, label: 'Driving License', icon: '🚗' },
//     { value: TypeOfVerification.PASSPORT, label: 'Passport', icon: '📘' },
//     { value: TypeOfVerification.OTHER, label: 'Other Document', icon: '📄' }
//   ];
  
//   acceptedFileTypes = '.jpg,.jpeg,.png,.pdf';
//   maxFileSize = 5 * 1024 * 1024; // 5MB

//   constructor(
//     private fb: FormBuilder,
//     private hostVerificationService: HostVerificationService,
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     this.initializeForm();
//   }

//   initializeForm(): void {
//     this.verificationForm = this.fb.group({
//       type: [TypeOfVerification.GOVERNMENT_ID, Validators.required],
//       documentUrl1: [null, Validators.required],
//       documentUrl2: [null, Validators.required]
//     });
//   }

//   onFileSelect(event: Event, documentNumber: 1 | 2): void {
//     const input = event.target as HTMLInputElement;
//     if (input.files && input.files[0]) {
//       const file = input.files[0];
      
//       // Validate file size
//       if (file.size > this.maxFileSize) {
//         this.error = 'File size must be less than 5MB';
//         input.value = '';
//         return;
//       }
      
//       // Validate file type
//       const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
//       if (!this.acceptedFileTypes.includes(fileExtension)) {
//         this.error = 'Please upload JPG, JPEG, PNG, or PDF files only';
//         input.value = '';
//         return;
//       }
      
//       // Create preview
//       const reader = new FileReader();
//       reader.onload = (e: ProgressEvent<FileReader>) => {
//         const preview: FilePreview = {
//           file: file,
//           url: e.target?.result as string
//         };
        
//         if (documentNumber === 1) {
//           this.documentPreview1 = preview;
//           this.verificationForm.patchValue({ documentUrl1: file });
//         } else {
//           this.documentPreview2 = preview;
//           this.verificationForm.patchValue({ documentUrl2: file });
//         }
//       };
      
//       reader.readAsDataURL(file);
//       this.error = null;
//     }
//   }

//   removeFile(documentNumber: 1 | 2): void {
//     if (documentNumber === 1) {
//       this.documentPreview1 = null;
//       this.verificationForm.patchValue({ documentUrl1: null });
//     } else {
//       this.documentPreview2 = null;
//       this.verificationForm.patchValue({ documentUrl2: null });
//     }
    
//     // Reset file input
//     const fileInput = document.getElementById(`document${documentNumber}`) as HTMLInputElement;
//     if (fileInput) {
//       fileInput.value = '';
//     }
//   }

//   isImageFile(url: string): boolean {
//     return !url.includes('application/pdf');
//   }

//   onSubmit(): void {
//     if (this.verificationForm.invalid) {
//       Object.keys(this.verificationForm.controls).forEach(key => {
//         const control = this.verificationForm.get(key);
//         if (control && control.invalid) {
//           control.markAsTouched();
//         }
//       });
//       return;
//     }

//     this.isSubmitting = true;
//     this.error = null;
    
//     const verificationData: HostVerificationRequest = {
//       type: this.verificationForm.value.type,
//       documentUrl1: this.verificationForm.value.documentUrl1,
//       documentUrl2: this.verificationForm.value.documentUrl2
//     };

//     this.hostVerificationService.addHostVerification(verificationData).subscribe({
//       next: (response) => {
//         this.success = true;
//         this.isSubmitting = false;
        
//         // Show success message for 3 seconds then redirect
//         setTimeout(() => {
//           this.router.navigate(['/host/dashboard']);
//         }, 3000);
//       },
//       error: (error) => {
//         this.error = error.message || 'An error occurred while submitting your verification';
//         this.isSubmitting = false;
//       }
//     });
//   }

//   getSelectedTypeLabel(): string {
//     const selectedType = this.verificationForm.get('type')?.value;
//     const type = this.verificationTypes.find(t => t.value === selectedType);
//     return type ? type.label : '';
//   }
// }
// add-verifications.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { 
  HostVerificationService 
} from '../host-verification.service';
import { 
  TypeOfVerification, 
  HostVerificationRequest 
} from '../host-verification.model';

interface FilePreview {
  file: File;
  url: string;
}

@Component({
  selector: 'app-add-verifications',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './add-verifications.html',
  styleUrls: ['./add-verifications.css']
})
export class AddVerificationsComponent implements OnInit {
  verificationForm!: FormGroup;
  isSubmitting = false;
  error: string | null = null;
  success = false;
  
  documentPreview1: FilePreview | null = null;
  documentPreview2: FilePreview | null = null;
  
  verificationTypes = [
    { value: TypeOfVerification.GOVERNMENT_ID, label: 'Government ID', icon: '🪪' },
    { value: TypeOfVerification.DRIVING_LICENSE, label: 'Driving License', icon: '🚗' },
    { value: TypeOfVerification.PASSPORT, label: 'Passport', icon: '📘' },
    { value: TypeOfVerification.OTHER, label: 'Other Document', icon: '📄' }
  ];
  
  acceptedFileTypes = '.jpg,.jpeg,.png,.pdf';
  maxFileSize = 5 * 1024 * 1024; // 5MB

  constructor(
    private fb: FormBuilder,
    private hostVerificationService: HostVerificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.verificationForm = this.fb.group({
      type: [TypeOfVerification.GOVERNMENT_ID, Validators.required],
      documentUrl1: [null, Validators.required],
      documentUrl2: [null, Validators.required]
    });
  }

  onFileSelect(event: Event, documentNumber: 1 | 2): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      // Validate file size
      if (file.size > this.maxFileSize) {
        this.error = 'File size must be less than 5MB';
        input.value = '';
        return;
      }
      
      // Validate file type
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!this.acceptedFileTypes.includes(fileExtension)) {
        this.error = 'Please upload JPG, JPEG, PNG, or PDF files only';
        input.value = '';
        return;
      }
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const preview: FilePreview = {
          file: file,
          url: e.target?.result as string
        };
        
        if (documentNumber === 1) {
          this.documentPreview1 = preview;
          this.verificationForm.patchValue({ documentUrl1: file });
        } else {
          this.documentPreview2 = preview;
          this.verificationForm.patchValue({ documentUrl2: file });
        }
      };
      
      reader.readAsDataURL(file);
      this.error = null;
    }
  }

  removeFile(documentNumber: 1 | 2): void {
    if (documentNumber === 1) {
      this.documentPreview1 = null;
      this.verificationForm.patchValue({ documentUrl1: null });
    } else {
      this.documentPreview2 = null;
      this.verificationForm.patchValue({ documentUrl2: null });
    }
    
    // Reset file input
    const fileInput = document.getElementById(`document${documentNumber}`) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  isImageFile(url: string): boolean {
    return !url.includes('application/pdf');
  }

  onSubmit(): void {
    console.log('📥 Submitting verification form:', this.verificationForm.value);
    if (this.verificationForm.invalid) {
      console.log('the if condition started');
      Object.keys(this.verificationForm.controls).forEach(key => {
        console.log('This is the key' + key)
        const control = this.verificationForm.get(key);
        console.log('This is the control' + control)
        if (control && control.invalid) {
          control.markAsTouched();
          console.log(`Field ${key} is invalid`);
        }
      });
      return;
    }

    this.isSubmitting = true;
    this.error = null;
    
    // ✅ FIXED: Create request data structure matching the new service
    const verificationData: HostVerificationRequest = {
      type: this.verificationForm.value.type,
      documentUrl1: this.verificationForm.value.documentUrl1,
      documentUrl2: this.verificationForm.value.documentUrl2
    };

    console.log('📤 Submitting verification:', {
      type: verificationData.type,
      file1: verificationData.documentUrl1?.name,
      file2: verificationData.documentUrl2?.name
    });

    // ✅ FIXED: Use the correct method name 'addVerification' instead of 'addHostVerification'
    this.hostVerificationService.addVerification(verificationData).subscribe({
      next: (response) => {
        console.log('✅ Verification submitted successfully:', response);
        this.success = true;
        this.isSubmitting = false;
        
        // Show success message for 3 seconds then redirect
        setTimeout(() => {
          this.router.navigate(['/host/dashboard']);
        }, 3000);
      },
      error: (error) => {
        console.error('❌ Verification submission failed:', error);
        
        // ✅ FIXED: Better error handling to extract the actual error message
        let errorMessage = 'An error occurred while submitting your verification';
        
        if (error.error) {
          if (typeof error.error === 'string') {
            errorMessage = error.error;
          } else if (error.error.error) {
            errorMessage = error.error.error;
          } else if (error.error.message) {
            errorMessage = error.error.message;
          }
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        this.error = errorMessage;
        this.isSubmitting = false;
      }
    });
  }

  getSelectedTypeLabel(): string {
    const selectedType = this.verificationForm.get('type')?.value;
    const type = this.verificationTypes.find(t => t.value === selectedType);
    return type ? type.label : '';
  }

  // ✅ ADDED: Helper method to get selected type icon
  getSelectedTypeIcon(): string {
    const selectedType = this.verificationForm.get('type')?.value;
    const type = this.verificationTypes.find(t => t.value === selectedType);
    return type ? type.icon : '📄';
  }

  // ✅ ADDED: Helper method to check if form field has error
  hasFieldError(fieldName: string): boolean {
    const field = this.verificationForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  // ✅ ADDED: Helper method to get field error message
  getFieldError(fieldName: string): string {
    const field = this.verificationForm.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors['required']) {
        switch(fieldName) {
          case 'type': return 'Please select a verification type';
          case 'documentUrl1': return 'Please upload the first document';
          case 'documentUrl2': return 'Please upload the second document';
          default: return 'This field is required';
        }
      }
    }
    return '';
  }

  // ✅ ADDED: Helper method to format file size
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // ✅ ADDED: Helper method to reset the entire form
  resetForm(): void {
    this.verificationForm.reset();
    this.verificationForm.patchValue({ type: TypeOfVerification.GOVERNMENT_ID });
    this.documentPreview1 = null;
    this.documentPreview2 = null;
    this.error = null;
    this.success = false;
    
    // Reset file inputs
    const fileInput1 = document.getElementById('document1') as HTMLInputElement;
    const fileInput2 = document.getElementById('document2') as HTMLInputElement;
    if (fileInput1) fileInput1.value = '';
    if (fileInput2) fileInput2.value = '';
  }
}