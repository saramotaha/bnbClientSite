import { Component } from '@angular/core';
import { ImageGallery } from "../components/image-gallery/image-gallery";

@Component({
  selector: 'app-property-details',
  imports: [ImageGallery],
  templateUrl: './property-details.html',
  styleUrl: './property-details.css'
})
export class PropertyDetails {
  constructor() {
  }
propertyId= 1;
}
