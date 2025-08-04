import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PropertyService } from '../Services/property.service';
import { Property, PropertyImage } from '../Models/property.model';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-edit-property',
  templateUrl: './edit-property.component.html',
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class EditPropertyComponent implements OnInit {
  propertyForm!: FormGroup;
  propertyId!: number;
  property!: Property;
  images: PropertyImage[] = [];
  selectedImages: File[] = [];
  previewImages: string[] = [];
  modalMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private propertyService: PropertyService,
    private fb: FormBuilder,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.propertyId = Number(id);
    if (isNaN(this.propertyId)) {
      this.openModal('❌ Invalid property ID');
      this.router.navigate(['/host/dashboard/listings']);
      return;
    }

    this.loadProperty();
    this.loadPropertyImages();
  }

  loadProperty(): void {
    this.propertyService.getById(this.propertyId).subscribe({
      next: (prop) => {
        this.property = prop;
        this.propertyForm = this.fb.group({
          title: [prop.title, Validators.required],
          description: [prop.description, Validators.required],
          pricePerNight: [prop.pricePerNight, [Validators.required, Validators.min(0)]],
          maxGuests: [prop.maxGuests, [Validators.required, Validators.min(1)]]
        });
        this.cdr.detectChanges();
      },
      error: () => {
        this.openModal('❌ Failed to load property');
        this.router.navigate(['/host/dashboard/listings']);
      }
    });
  }

  loadPropertyImages(): void {
    this.http.get<PropertyImage[]>(`http://localhost:7145/api/properties/${this.propertyId}/images`)
      .subscribe(images => {
        this.images = images;
      });
  }

  onImageSelected(event: any): void {
    const files = event.target.files;

if (files && files.length > 0) {
  const fileArray: File[] = Array.from(files); 
  this.selectedImages = fileArray;
  this.previewImages = fileArray.map(file => URL.createObjectURL(file));
}

  }

  uploadSelectedImages(): void {
    const uploadTasks = this.selectedImages.map(file => {
      const formData = new FormData();
      formData.append('image', file);
      return this.http.post(`http://localhost:7145/api/properties/${this.propertyId}/images`, formData).toPromise();
    });

    Promise.all(uploadTasks)
      .then(() => {
        this.openModal('✅ Images uploaded successfully');
        this.selectedImages = [];
        this.previewImages = [];
        this.loadPropertyImages();
      })
      .catch(() => {
        this.openModal('❌ Error uploading one or more images');
      });
  }

  
  saveChanges(): void {
    const updatedFields = this.propertyForm.value;

    this.propertyService.update(this.propertyId, updatedFields).subscribe({
      next: () => {
        this.openModal('✅ Property updated successfully');
        this.router.navigate(['/host/dashboard/listings']);
      },
      error: (err) => {
        console.error('Update failed:', err);
        this.openModal('❌ Failed to update property');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/host/dashboard/listings']);
  }

  openModal(message: string): void {
  this.modalMessage = message;
  const modalElement = document.getElementById('feedbackModal');
  if (modalElement) {
    const modal = new (window as any).bootstrap.Modal(modalElement);
    modal.show();

    setTimeout(() => {
      modal.hide();
    }, 1000);
  }
}

}
