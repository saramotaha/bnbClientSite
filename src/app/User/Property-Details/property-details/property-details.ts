
  import { ChangeDetectorRef, Component, NgModule, OnInit } from '@angular/core';
  import { ImageGallery } from "../components/image-gallery/image-gallery";
  import { Footer } from "../../../Shared/footer/footer";
  import { BehaviorSubject } from 'rxjs';
  import { IPropertyList } from '../../../Core/Models/iproperty-list';
  import { PropertyDetailsService } from './property-details-service';
  import { PropertyDetialsReview } from "../components/property-detials-review/property-detials-review";
  import { Hostinfo } from "../components/hostinfo/hostinfo";
  import { Propertybookingcard } from "../components/propertybookingcard/propertybookingcard";
  import { PropertydetailsAmenities } from "../components/propertydetails-amenities/propertydetails-amenities";
  import { PropertydetailsCalendar } from "../components/propertydetails-calendar/propertydetails-calendar";
  import { Route, ActivatedRoute } from '@angular/router';
  import { PorpertyLocation } from "../components/porperty-location/porperty-location";
import { PropertyHost } from "../components/property-host/property-host";
import { Nav } from '../../../Shared/nav/nav';
import { ViolationService } from '../../../components/host/pt2/services/violation.service';
import { AuthService } from '../../../Pages/Auth/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ViolationType } from '../../../components/host/pt2/models/violation.model';

  
  @Component({
    selector: 'app-property-details',
    imports: [ImageGallery, Nav, Footer, PropertyDetialsReview, Propertybookingcard, PropertydetailsAmenities, PropertydetailsCalendar, PorpertyLocation, PropertyHost, FormsModule, CommonModule],

  templateUrl: './property-details.html',
    styleUrl: './property-details.css'
  })
  export class PropertyDetails implements OnInit {
    constructor(private PropertyDetailsService:PropertyDetailsService, private cdr: ChangeDetectorRef,private route:ActivatedRoute
                , private activatedRoute: ActivatedRoute , private violationService : ViolationService, private authService:AuthService ) {}
    propertyId!:number;
    propertyDetails !: IPropertyList;
    longitude! :number
    latitude! :number
    address!: string;
    hostId!: number;
    selectedCheckIn: string = '';
    selectedCheckOut: string = '';
  selectedViolationType: ViolationType = ViolationType.Other; // Default value
    ngOnInit(): void {
      this.route.params.subscribe(params => {
        this.propertyId = +params['id']; // Get the property ID from the route parameters
        console.log('Property ID from route:', this.propertyId);
      });
      this.PropertyDetailsService.getPropertyDetailsById(this.propertyId).subscribe({
        next: (propertyDetailsRes) => {
          this.propertyDetails = propertyDetailsRes;
          console.log('Property details fetched successfully:', propertyDetailsRes); 
                  console.log('Property detailsDes successfully:', propertyDetailsRes.description);
                  // ✅ Assign after the property is loaded
                            console.log('HEEEEProperty detailsssssss y:', this.propertyDetails); 

        this.longitude = this.propertyDetails?.longitude;
        this.latitude = this.propertyDetails?.latitude;
        this.address = this.propertyDetails?.country + ', ' + this.propertyDetails?.city;
        this.hostId = this.propertyDetails?.hostId;
          console.log('lat', this.latitude);
        console.log('long', this.longitude);
                            console.log('Host:', this.hostId); 

          this.cdr.detectChanges();
        } ,
        error: (error) => { 
          console.error('Error fetching property details:', error);
        }
      });      
      
    }
    onDatesSelected( event: { checkIn: string; checkOut: string } ){
      this.selectedCheckIn = event.checkIn;
      this.selectedCheckOut = event.checkOut;
    }


//   reportData = {
//     title: '',
//     description: ''
//   };
//   isSubmitted = false;

// // Open modal function
//   openReportModal(content: any) {
//     this.resetForm();
//     // this.modalService.open(content, { ariaLabelledBy: 'report-modal-title' });
//   }

//   // Handle form submission
//   submitReport() {
//     console.log('Report submitted:', this.reportData);
//     // Here you would typically call your API service
//     // Example:
//     // this.apiService.submitReport(this.reportData).subscribe({
//     //   next: () => this.isSubmitted = true,
//     //   error: (err) => console.error('Error submitting report:', err)
//     // });
    
        
//      const dto = {
//           reportedById: Number(this.authService.getUserId()), // Assuming you have a method to get the current user's ID;
//       reportedPropertyId: this.propertyId, // Assuming you have the property ID available;
//       reportedHostId: this.propertyDetails?.hostId, // Assuming you have the host ID available;
//       violationType: this.reportData.title, // Example violation type;
//       description: this.reportData.description,
//       };
//       this.violationService.createViolation(dto).subscribe({
//         next: (response) => {
//           console.log('Report submitted successfully:', response);
//         },
//         error: (error) => {
//           console.error('Error submitting report:', error);
//           alert('Failed to submit report. Please try again later.');
//         }
//       });



//     // For demo purposes, we'll just set isSubmitted to true
//     this.isSubmitted = true;
//   }

//   // Reset form when modal is closed
//   resetForm() {
//     this.reportData = {
//       title: '',
//       description: ''
//     };
//     this.isSubmitted = false;
//   }

//   // Close modal
//   closeModal(modal: any) {
//     modal.close();
//     this.resetForm();
//   }

formatViolationType(typeValue: number): string {
  // Get the enum name from the numeric value
  const typeName = ViolationType[typeValue];
  
  // Format the name for display
  return typeName
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
    .trim();
}

violationTypes = [
  { value: ViolationType.PropertyMisrepresentation, label: 'Property Misrepresentation' },
  { value: ViolationType.HostMisconduct, label: 'Host Misconduct' },
  { value: ViolationType.SafetyIssue, label: 'Safety Issue' },
  { value: ViolationType.PolicyViolation, label: 'Policy Violation' },
  { value: ViolationType.FraudulentActivity, label: 'Fraudulent Activity' },
  { value: ViolationType.Other, label: 'Other' }
];

 report = {
    description: ''
  };

  isSubmitted = false;

  submitReport(): void {
console.log('Report HostId:', this.propertyDetails?.hostId);
console.log('Report UserID:', Number(this.authService.getUserId()));
console.log('Report PropertyID:', this.propertyId);
console.log('Report title:', this.selectedViolationType); 
console.log('Report desc:', this.report.description); 
        
     const dto = {
          reportedById: Number(this.authService.getUserId()), // Assuming you have a method to get the current user's ID;
      reportedPropertyId: this.propertyId, // Assuming you have the property ID available;
      reportedHostId: this.propertyDetails?.hostId, // Assuming you have the host ID available;
      violationType: this.selectedViolationType, // Example violation type;
      description: this.report.description,
      };
      this.violationService.createViolation(dto).subscribe({
        next: (response) => {
          console.log('Report submitted successfully:', response);
        },
        error: (error) => {
          console.error('Error submitting report:', error);
          alert('Failed to submit report. Please try again later.');
        }
      });


    // 🔒 Optionally add backend API call here
    console.log('Report submitted:', this.report);

    this.isSubmitted = true;

    // Optionally reset after a delay
    setTimeout(() => {
      this.resetForm();
    }, 3000);
  }

  resetForm(): void {
    this.report = {
      description: ''
    };
    this.isSubmitted = false;
  }
    
}

  
//  const dto = {
//       reportedById: Number(this.authService.getUserId()), // Assuming you have a method to get the current user's ID;
//   reportedPropertyId: this.propertyId, // Assuming you have the property ID available;
//   reportedHostId: this.propertyDetails?.hostId, // Assuming you have the host ID available;
//   violationType: this.reportReason, // Example violation type;
//   description: this.reportDescription,
//   };
//   this.violationService.createViolation(dto).subscribe({
//     next: (response) => {
//       console.log('Report submitted successfully:', response);
//     },
//     error: (error) => {
//       console.error('Error submitting report:', error);
//       alert('Failed to submit report. Please try again later.');
//     }
//   });
