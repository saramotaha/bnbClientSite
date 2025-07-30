import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Property } from '../Models/property.model';
import { PropertyService } from '../Services/property.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';

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
    private router: Router
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
getPrimaryImage(property: Property): string | undefined {
  const primary = property.images?.find(img => img.isPrimary);
  const fallback = property.images?.[0]; 

  const image = primary || fallback;

  return image?.imageUrl?.startsWith('http')
    ? image.imageUrl
    : image?.imageUrl
    ? `https://localhost:7145/images/${image.imageUrl}`
    : undefined; 
}



getFullImageUrl(imageName: string | undefined): string {
  if (!imageName) return 'assets/default-image.jpg';
  return imageName.startsWith('http')
    ? imageName
    : `https://localhost:7145/images/${imageName}`;
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
