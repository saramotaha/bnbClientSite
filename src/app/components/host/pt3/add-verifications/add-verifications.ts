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
      
//       console.log(`📄 File ${documentNumber} selected:`, {
//         name: file.name,
//         size: file.size,
//         type: file.type
//       });
      
//       // ✅ IMPROVED: Better file validation
//       if (file.size > this.maxFileSize) {
//         this.error = `File size must be less than ${this.formatFileSize(this.maxFileSize)}`;
//         input.value = '';
//         return;
//       }
      
//       // ✅ IMPROVED: More robust file type validation
//       const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
//       const validTypes = ['.jpg', '.jpeg', '.png', '.pdf'];
//       if (!validTypes.includes(fileExtension)) {
//         this.error = 'Please upload JPG, JPEG, PNG, or PDF files only';
//         input.value = '';
//         return;
//       }
      
//       // ✅ IMPROVED: Better MIME type validation
//       const validMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
//       if (!validMimeTypes.includes(file.type)) {
//         this.error = 'Invalid file type. Please upload JPG, PNG, or PDF files only';
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
//           console.log('✅ Document 1 loaded successfully');
//         } else {
//           this.documentPreview2 = preview;
//           this.verificationForm.patchValue({ documentUrl2: file });
//           console.log('✅ Document 2 loaded successfully');
//         }
        
//         // ✅ Mark field as touched to trigger validation
//         this.verificationForm.get(`documentUrl${documentNumber}`)?.markAsTouched();
//       };
      
//       reader.onerror = (error) => {
//         console.error('❌ File reading error:', error);
//         this.error = 'Failed to read file. Please try again.';
//       };
      
//       reader.readAsDataURL(file);
//       this.error = null; // Clear any previous errors
//     }
//   }

//   removeFile(documentNumber: 1 | 2): void {
//     console.log(`🗑️ Removing document ${documentNumber}`);
    
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
    
//     // Mark field as touched to show validation error
//     this.verificationForm.get(`documentUrl${documentNumber}`)?.markAsTouched();
//   }

//   isImageFile(url: string): boolean {
//     return !url.includes('application/pdf');
//   }

//   // ✅ FIXED: Improved form submission with better validation
//   onSubmit(): void {
//     console.log('📥 Starting form submission...');
//     console.log('📋 Form data:', {
//       type: this.verificationForm.value.type,
//       hasDoc1: !!this.documentPreview1,
//       hasDoc2: !!this.documentPreview2,
//       formValid: this.verificationForm.valid
//     });

//     // ✅ IMPROVED: Comprehensive validation
//     if (this.verificationForm.invalid || !this.documentPreview1 || !this.documentPreview2) {
//       console.log('❌ Form validation failed:');
//       console.log('- Form invalid:', this.verificationForm.invalid);
//       console.log('- Document 1 missing:', !this.documentPreview1);
//       console.log('- Document 2 missing:', !this.documentPreview2);
      
//       // Mark all fields as touched to show validation errors
//       Object.keys(this.verificationForm.controls).forEach(key => {
//         const control = this.verificationForm.get(key);
//         if (control) {
//           control.markAsTouched();
//           if (control.invalid) {
//             console.log(`❌ Field ${key} errors:`, control.errors);
//           }
//         }
//       });
      
//       // Set appropriate error message
//       if (!this.documentPreview1 || !this.documentPreview2) {
//         this.error = 'Please upload both front and back side documents';
//       } else {
//         this.error = 'Please fill all required fields';
//       }
//       return;
//     }

//     // ✅ Final validation before submission
//     if (!this.documentPreview1.file || !this.documentPreview2.file) {
//       this.error = 'File upload error. Please try uploading the documents again.';
//       return;
//     }

//     this.isSubmitting = true;
//     this.error = null;
    
//     // ✅ IMPROVED: Create request data with proper file objects
//     const verificationData: HostVerificationRequest = {
//       type: this.verificationForm.value.type,
//       documentUrl1: this.documentPreview1.file, // Use file from preview
//       documentUrl2: this.documentPreview2.file  // Use file from preview
//     };

//     console.log('📤 Submitting verification:', {
//       type: verificationData.type,
//       file1Name: verificationData.documentUrl1.name,
//       file1Size: this.formatFileSize(verificationData.documentUrl1.size),
//       file2Name: verificationData.documentUrl2.name,
//       file2Size: this.formatFileSize(verificationData.documentUrl2.size)
//     });

//     // ✅ Submit to service
//     this.hostVerificationService.addVerification(verificationData).subscribe({
//       next: (response) => {
//         console.log('✅ Verification submitted successfully:', response);
//         this.success = true;
//         this.isSubmitting = false;
        
//         // ✅ IMPROVED: Better success handling
//         setTimeout(() => {
//           this.router.navigate(['/host/dashboard']);
//         }, 2000); // Reduced from 3 seconds to 2 seconds
//       },
//       error: (error) => {
//         console.error('❌ Verification submission failed:', error);
        
//         // ✅ IMPROVED: Better error handling
//         let errorMessage = 'An error occurred while submitting your verification';
        
//         if (error.status === 400) {
//           errorMessage = 'Invalid data submitted. Please check your files and try again.';
//         } else if (error.status === 401) {
//           errorMessage = 'Authentication failed. Please log in again.';
//         } else if (error.status === 409) {
//           errorMessage = 'You already have this type of verification. Please use update instead.';
//         } else if (error.status === 413) {
//           errorMessage = 'Files are too large. Please upload smaller files.';
//         } else if (error.error) {
//           if (typeof error.error === 'string') {
//             errorMessage = error.error;
//           } else if (error.error.error) {
//             errorMessage = error.error.error;
//           } else if (error.error.message) {
//             errorMessage = error.error.message;
//           }
//         } else if (error.message) {
//           errorMessage = error.message;
//         }
        
//         this.error = errorMessage;
//         this.isSubmitting = false;
//       }
//     });
//   }

//   getSelectedTypeLabel(): string {
//     const selectedType = this.verificationForm.get('type')?.value;
//     const type = this.verificationTypes.find(t => t.value === selectedType);
//     return type ? type.label.toLowerCase() : 'document';
//   }

//   // ✅ IMPROVED: Helper method to get selected type icon
//   getSelectedTypeIcon(): string {
//     const selectedType = this.verificationForm.get('type')?.value;
//     const type = this.verificationTypes.find(t => t.value === selectedType);
//     return type ? type.icon : '📄';
//   }

//   // ✅ IMPROVED: Helper method to check if form field has error
//   hasFieldError(fieldName: string): boolean {
//     const field = this.verificationForm.get(fieldName);
//     return !!(field && field.invalid && field.touched);
//   }

//   // ✅ IMPROVED: Helper method to get field error message
//   getFieldError(fieldName: string): string {
//     const field = this.verificationForm.get(fieldName);
//     if (field && field.errors && field.touched) {
//       if (field.errors['required']) {
//         switch(fieldName) {
//           case 'type': return 'Please select a verification type';
//           case 'documentUrl1': return 'Please upload the front side document';
//           case 'documentUrl2': return 'Please upload the back side document';
//           default: return 'This field is required';
//         }
//       }
//     }
//     return '';
//   }

//   // ✅ IMPROVED: Helper method to format file size
//   formatFileSize(bytes: number): string {
//     if (bytes === 0) return '0 Bytes';
//     const k = 1024;
//     const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
//   }

//   // ✅ IMPROVED: Helper method to reset the entire form
//   resetForm(): void {
//     console.log('🔄 Resetting form...');
//     this.verificationForm.reset();
//     this.verificationForm.patchValue({ type: TypeOfVerification.GOVERNMENT_ID });
//     this.documentPreview1 = null;
//     this.documentPreview2 = null;
//     this.error = null;
//     this.success = false;
//     this.isSubmitting = false;
    
//     // Reset file inputs
//     const fileInput1 = document.getElementById('document1') as HTMLInputElement;
//     const fileInput2 = document.getElementById('document2') as HTMLInputElement;
//     if (fileInput1) fileInput1.value = '';
//     if (fileInput2) fileInput2.value = '';
//   }

//   // ✅ NEW: Helper method to check if files are ready
//   get filesReady(): boolean {
//     return !!(this.documentPreview1 && this.documentPreview2);
//   }

//   // ✅ NEW: Helper method to get upload progress text
//   get uploadStatusText(): string {
//     if (this.documentPreview1 && this.documentPreview2) {
//       return 'Ready to submit';
//     } else if (this.documentPreview1 || this.documentPreview2) {
//       return 'Upload remaining document';
//     } else {
//       return 'Upload both documents to continue';
//     }
//   }
// }
// ===== FIXED ADD-VERIFICATIONS.COMPONENT.TS =====

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
      
      console.log(`📄 File ${documentNumber} selected:`, {
        name: file.name,
        size: file.size,
        type: file.type
      });
      
      // ✅ IMPROVED: Better file validation
      if (file.size > this.maxFileSize) {
        this.error = `File size must be less than ${this.formatFileSize(this.maxFileSize)}`;
        input.value = '';
        return;
      }
      
      // ✅ IMPROVED: More robust file type validation
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      const validTypes = ['.jpg', '.jpeg', '.png', '.pdf'];
      if (!validTypes.includes(fileExtension)) {
        this.error = 'Please upload JPG, JPEG, PNG, or PDF files only';
        input.value = '';
        return;
      }
      
      // ✅ IMPROVED: Better MIME type validation
      const validMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!validMimeTypes.includes(file.type)) {
        this.error = 'Invalid file type. Please upload JPG, PNG, or PDF files only';
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
          console.log('✅ Document 1 loaded successfully');
        } else {
          this.documentPreview2 = preview;
          this.verificationForm.patchValue({ documentUrl2: file });
          console.log('✅ Document 2 loaded successfully');
        }
        
        // ✅ Mark field as touched to trigger validation
        this.verificationForm.get(`documentUrl${documentNumber}`)?.markAsTouched();
      };
      
      reader.onerror = (error) => {
        console.error('❌ File reading error:', error);
        this.error = 'Failed to read file. Please try again.';
      };
      
      reader.readAsDataURL(file);
      this.error = null; // Clear any previous errors
    }
  }

  removeFile(documentNumber: 1 | 2): void {
    console.log(`🗑️ Removing document ${documentNumber}`);
    
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
    
    // Mark field as touched to show validation error
    this.verificationForm.get(`documentUrl${documentNumber}`)?.markAsTouched();
  }

  isImageFile(url: string): boolean {
    return !url.includes('application/pdf');
  }

  // ✅ FIXED: Improved form submission with better validation
  onSubmit(): void {
    console.log('📥 Starting form submission...');
    console.log('📋 Form data:', {
      type: this.verificationForm.value.type,
      hasDoc1: !!this.documentPreview1,
      hasDoc2: !!this.documentPreview2,
      formValid: this.verificationForm.valid
    });

    // ✅ IMPROVED: Comprehensive validation
    if (this.verificationForm.invalid || !this.documentPreview1 || !this.documentPreview2) {
      console.log('❌ Form validation failed:');
      console.log('- Form invalid:', this.verificationForm.invalid);
      console.log('- Document 1 missing:', !this.documentPreview1);
      console.log('- Document 2 missing:', !this.documentPreview2);
      
      // Mark all fields as touched to show validation errors
      Object.keys(this.verificationForm.controls).forEach(key => {
        const control = this.verificationForm.get(key);
        if (control) {
          control.markAsTouched();
          if (control.invalid) {
            console.log(`❌ Field ${key} errors:`, control.errors);
          }
        }
      });
      
      // Set appropriate error message
      if (!this.documentPreview1 || !this.documentPreview2) {
        this.error = 'Please upload both front and back side documents';
      } else {
        this.error = 'Please fill all required fields';
      }
      return;
    }

    // ✅ Final validation before submission
    if (!this.documentPreview1.file || !this.documentPreview2.file) {
      this.error = 'File upload error. Please try uploading the documents again.';
      return;
    }

    this.isSubmitting = true;
    this.error = null;
    
    // ✅ IMPROVED: Create request data with proper file objects
    const verificationData: HostVerificationRequest = {
      type: this.verificationForm.value.type,
      documentUrl1: this.documentPreview1.file, // Use file from preview
      documentUrl2: this.documentPreview2.file  // Use file from preview
    };

    console.log('📤 Submitting verification:', {
      type: verificationData.type,
      file1Name: verificationData.documentUrl1.name,
      file1Size: this.formatFileSize(verificationData.documentUrl1.size),
      file2Name: verificationData.documentUrl2.name,
      file2Size: this.formatFileSize(verificationData.documentUrl2.size)
    });

    // ✅ Submit to service
    this.hostVerificationService.addVerification(verificationData).subscribe({
      next: (response) => {
        console.log('✅ Verification submitted successfully:', response);
        this.success = true;
        this.isSubmitting = false;
        
        // ✅ NEW: Clear all inputs after successful submission
        this.clearFormInputs();
        
        // ✅ IMPROVED: Better success handling
        setTimeout(() => {
          this.router.navigate(['/host/dashboard']);
        }, 2000); // Reduced from 3 seconds to 2 seconds
      },
      error: (error) => {
        console.error('❌ Verification submission failed:', error);
        
        // ✅ IMPROVED: Better error handling
        let errorMessage = 'An error occurred while submitting your verification';
        
        if (error.status === 400) {
          errorMessage = 'Invalid data submitted. Please check your files and try again.';
        } else if (error.status === 401) {
          errorMessage = 'Authentication failed. Please log in again.';
        } else if (error.status === 409) {
          errorMessage = 'You already have this type of verification. Please use update instead.';
        } else if (error.status === 413) {
          errorMessage = 'Files are too large. Please upload smaller files.';
        } else if (error.error) {
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
    return type ? type.label.toLowerCase() : 'document';
  }

  // ✅ IMPROVED: Helper method to get selected type icon
  getSelectedTypeIcon(): string {
    const selectedType = this.verificationForm.get('type')?.value;
    const type = this.verificationTypes.find(t => t.value === selectedType);
    return type ? type.icon : '📄';
  }

  // ✅ IMPROVED: Helper method to check if form field has error
  hasFieldError(fieldName: string): boolean {
    const field = this.verificationForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  // ✅ IMPROVED: Helper method to get field error message
  getFieldError(fieldName: string): string {
    const field = this.verificationForm.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors['required']) {
        switch(fieldName) {
          case 'type': return 'Please select a verification type';
          case 'documentUrl1': return 'Please upload the front side document';
          case 'documentUrl2': return 'Please upload the back side document';
          default: return 'This field is required';
        }
      }
    }
    return '';
  }

  // ✅ IMPROVED: Helper method to format file size
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // ✅ NEW: Method to clear form inputs after successful submission
  clearFormInputs(): void {
    console.log('🧹 Clearing form inputs after successful submission...');
    
    // Clear file previews
    this.documentPreview1 = null;
    this.documentPreview2 = null;
    
    // Reset form to initial state
    this.verificationForm.reset();
    this.verificationForm.patchValue({ 
      type: TypeOfVerification.GOVERNMENT_ID,
      documentUrl1: null,
      documentUrl2: null
    });
    
    // Clear file inputs in DOM
    const fileInput1 = document.getElementById('document1') as HTMLInputElement;
    const fileInput2 = document.getElementById('document2') as HTMLInputElement;
    if (fileInput1) {
      fileInput1.value = '';
      console.log('✅ File input 1 cleared');
    }
    if (fileInput2) {
      fileInput2.value = '';
      console.log('✅ File input 2 cleared');
    }
    
    // Mark form as pristine and untouched
    this.verificationForm.markAsPristine();
    this.verificationForm.markAsUntouched();
    
    console.log('✅ All form inputs cleared successfully');
  }

  // ✅ IMPROVED: Helper method to reset the entire form
  resetForm(): void {
    console.log('🔄 Resetting form...');
    this.verificationForm.reset();
    this.verificationForm.patchValue({ type: TypeOfVerification.GOVERNMENT_ID });
    this.documentPreview1 = null;
    this.documentPreview2 = null;
    this.error = null;
    this.success = false;
    this.isSubmitting = false;
    
    // Reset file inputs
    const fileInput1 = document.getElementById('document1') as HTMLInputElement;
    const fileInput2 = document.getElementById('document2') as HTMLInputElement;
    if (fileInput1) fileInput1.value = '';
    if (fileInput2) fileInput2.value = '';
  }

  // ✅ NEW: Helper method to check if files are ready
  get filesReady(): boolean {
    return !!(this.documentPreview1 && this.documentPreview2);
  }

  // ✅ NEW: Helper method to get upload progress text
  get uploadStatusText(): string {
    if (this.documentPreview1 && this.documentPreview2) {
      return 'Ready to submit';
    } else if (this.documentPreview1 || this.documentPreview2) {
      return 'Upload remaining document';
    } else {
      return 'Upload both documents to continue';
    }
  }
}