import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ListingService } from '../Listing.Service';

@Component({
  selector: 'app-step6',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './step6.component.html',
  styleUrls: ['./step6.component.css']
})
export class Step6Component implements OnInit {
  showUploadModal = false;
  selectedFiles: File[] = [];
  uploadedImages: string[] = [];
  showSuccess = false;

  constructor(
    private router: Router,
    private listingService: ListingService
  ) {}

  ngOnInit(): void {
    // استرجاع الصور لو كانت محفوظة في service
    this.uploadedImages = this.listingService.listingData.imageUrls || [];
  }

  openUploadModal() {
    this.showUploadModal = true;
  }

  closeUploadModal() {
    this.showUploadModal = false;
    this.selectedFiles = [];
  }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = Array.from(input.files);
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer?.files) {
      this.selectedFiles = Array.from(event.dataTransfer.files);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  async uploadToServer(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);

  const propertyId = this.listingService.getPropertyId();
  if (!propertyId) throw new Error('No property ID');

  const response = await fetch(`https://localhost:7145/api/properties/${propertyId}/images`, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    throw new Error('Upload failed');
  }

  const result = await response.json();
  console.log('Uploaded image name:', result.fileName);
  const imageName = result.fileName; // 🟢 خد الاسم فقط من الـ backend
  return `https://localhost:7145/images/${imageName}`; // 🟢 نركب المسار عندنا
}


  async uploadPhotos() {
    this.showUploadModal = false;

    try {
      const uploadedUrls = await Promise.all(
        this.selectedFiles.map(file => this.uploadToServer(file))
      );

      this.uploadedImages = uploadedUrls;
      this.listingService.listingData.imageUrls = uploadedUrls; // 🟢 حفظ الصور في الخدمة

      this.selectedFiles = [];
      this.showSuccess = true;

      setTimeout(() => {
        this.showSuccess = false;
        if (this.uploadedImages.length >= 5) {
          this.router.navigate(['/host/listings/create/step7']);
        }
      }, 2000);
    } catch (err) {
      console.error('Error uploading images:', err);
    }
  }

  goNext() {
    if (this.uploadedImages.length >= 5) {
      this.router.navigate(['/host/listings/create/step7']);
    }
  }

  goBack() {
    this.router.navigate(['/host/listings/create/step5']);
  }
}
