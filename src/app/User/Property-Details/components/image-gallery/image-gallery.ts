import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { IpropertImageGallery } from './iproperty-image-gallery';
import { PropertyImageService } from './service/property-image-service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-gallery',
  imports: [CommonModule],
  templateUrl: './image-gallery.html',
  styleUrl: './image-gallery.css'
})
export class ImageGallery implements OnInit {
  images!: IpropertImageGallery[]; 
  @Input() propertyId!: number;
   selectedImageIndex = 0;

  constructor( private route: ActivatedRoute,private propertyImageService: PropertyImageService,private cdr:ChangeDetectorRef ) {}
  ngOnInit(): void {
    this.propertyImageService.getAllimagesPropertyId(this.propertyId).subscribe({
      next: (imgsResponse) => {
        this.images = imgsResponse;
        console.log('Images fetched successfully:', imgsResponse);
        this.cdr.detectChanges(); // Ensure the view is updated with the new images
      },
      error: (error) => {
        console.error('Error fetching images:', error);
      }
    });
  }
 
  get primaryImage(): IpropertImageGallery | undefined {
    return this.images?.find(image => image.isPrimary);
  }
  get otherImages(): IpropertImageGallery[]|undefined {
    return this.images?.filter(image => !image.isPrimary) || [];
  }
  get selectedImage(): IpropertImageGallery | undefined {
    return this.images?.[this.selectedImageIndex];
  }
  selectImage(index: number) {
    this.selectedImageIndex = index;
  } 
}
