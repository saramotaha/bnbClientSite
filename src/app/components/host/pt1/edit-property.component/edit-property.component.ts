import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { PropertyService } from '../Services/property.service';
import { Property } from '../Models/property.model';

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

  constructor(
    private route: ActivatedRoute,
    private propertyService: PropertyService,
    private fb: FormBuilder,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.propertyId = Number(id);
    if (isNaN(this.propertyId)) {
      alert('Invalid property ID');
      this.router.navigate(['/host/listings']);
      return;
    }

    this.loadProperty();
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
        alert('❌ Failed to load property');
        this.router.navigate(['/host/listings']);
      }
    });
  }

 saveChanges(): void {
  const updatedFields = {
    title: this.propertyForm.value.title,
    description: this.propertyForm.value.description,
    pricePerNight: this.propertyForm.value.pricePerNight,
    maxGuests: this.propertyForm.value.maxGuests
  };
  // console.log(JSON.stringify(updatedFields, null, 2));

  this.propertyService.update(this.propertyId, updatedFields).subscribe({
    next: () => {
      alert('✅ Property updated successfully');
      this.router.navigate(['/host/listings']);
    },
    error: (err) => {
      console.error('Update failed:', err);
      alert('❌ Failed to update property');
    }
  });
}

  goBack(): void {
    this.router.navigate(['/host/listings']);
  }
}
