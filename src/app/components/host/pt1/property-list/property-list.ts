import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Property } from '../Models/property.model';
import { PropertyService } from '../Services/property.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http'; // ✅ مهم

declare const bootstrap: any;

@Component({
  selector: 'app-property-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './property-list.html',
  styleUrls: ['./property-list.css']
})
export class PropertyListComponent implements OnInit {
  properties: Property[] = [];
  isLoading = true;
  errorMessage = '';
  selectedProperty: Property | null = null;
  selectedType: string | null = null;

  constructor(
    private propertyService: PropertyService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private http: HttpClient // ✅ أضفناه هنا
  ) {}

  ngOnInit(): void {
    this.loadProperties();
  }

  loadProperties(): void {
    this.isLoading = true;
    this.propertyService.getAllByHost()
      .pipe(take(1))
      .subscribe({
        next: (data: Property[]) => {
          this.properties = data;

          // ✅ تحميل الصور لكل property
          this.properties.forEach(p => {
            if (p.id) this.loadImagesForProperty(p.id);
          });

          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.errorMessage = 'Failed to load properties.';
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
  }

  // ✅ تحميل الصور باستخدام endpoint زي صفحة الإيديت
  loadImagesForProperty(propertyId: number): void {
    this.http.get<any[]>(`http://localhost:7145/api/properties/${propertyId}/images`)
      .subscribe(images => {
        const prop = this.properties.find(p => p.id === propertyId);
        if (prop) {
          (prop as any).propertyImages = images; // dynamic assignment
          this.cdr.detectChanges();
        }
      });
  }

  // ✅ استخدم propertyImages بدل images
  getPrimaryImage(property: any): string {
    const primary = property.propertyImages?.find((img: any) => img.isPrimary);
    const fallback = property.propertyImages?.[0];
    const image = primary || fallback;

    return image?.imageUrl?.startsWith('http')
      ? image.imageUrl
      : image?.imageUrl
      ? `http://localhost:7145/images/${image.imageUrl}`
      : 'assets/default-image.jpg'; // fallback if no image
  }

  getFullImageUrl(imageName: string | undefined): string {
    if (!imageName) return 'assets/default-image.jpg';
    return imageName.startsWith('http')
      ? imageName
      : `http://localhost:7145/images/${imageName}`;
  }

  editProperty(property: Property): void {
    if (property.id) {
      this.closeModal('viewModal');
      setTimeout(() => {
        this.router.navigate(['/host/listings/edit', property.id]);
      }, 300);
    }
  }

  deleteProperty(id: number | undefined): void {
    if (!id) return;

    if (confirm('Are you sure you want to delete this property?')) {
      this.propertyService.delete(id)
        .pipe(take(1))
        .subscribe({
          next: () => {
            this.properties = this.properties.filter(p => p.id !== id);
            this.closeModal('viewModal');
            this.selectedProperty = null;
            this.cdr.detectChanges();
          },
          error: (error) => {
            console.error('Failed to delete property:', error);
          }
        });
    }
  }

  openViewModal(property: Property): void {
    this.selectedProperty = property;
    this.openModal('viewModal');
  }

  openModal(id: string): void {
    const modalEl = document.getElementById(id);
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  closeModal(id: string): void {
    const modalEl = document.getElementById(id);
    if (modalEl) {
      const modalInstance = bootstrap.Modal.getInstance(modalEl);
      modalInstance?.hide();
    }
  }

  selectType(type: string) {
    this.selectedType = type;
  }

  startCreate(): void {
    this.closeModal('createModal');
    this.propertyService.resetListingData();
    this.router.navigate(['/host/listings/create/step-1'], {
      queryParams: {
        new: true,
        type: this.selectedType
      }
    });
  }
}