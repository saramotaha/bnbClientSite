
// import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { PropertyService } from '../../../Services/property.service';
// import {
//   AdminPropertyListDto,
//   AdminPropertyResponseDto,
//   PropertyStatusUpdateDto,
//   PropertySoftDeleteDto,
//   PropertyDetailDto // Add the new interface
// } from '../../../Models/Property.model';

// @Component({
//   selector: 'app-admin-property-management',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './admin-property-management.html',
//   styleUrls: ['./admin-property-management.css'],
// })
// export class PropertyManagementComponent implements OnInit {
//   // Component State - Using the new DTOs
//   public allProperties: AdminPropertyListDto[] = [];
//   public pendingProperties: AdminPropertyListDto[] = [];
//   public approvedProperties: AdminPropertyListDto[] = [];
//   public currentSection: 'unverified-properties' | 'verified-properties' = 'unverified-properties';

//   // UI State
//   public isLoading = true;
//   public errorMessage: string | null = null;
//   public isDetailsModalOpen = false;
//   public isDeleteModalOpen = false;
//   public propertyToView: PropertyDetailDto | null = null; // Changed to PropertyDetailDto
//   public propertyToDelete: AdminPropertyListDto | null = null;

//   // Add loading states for individual operations
//   public isUpdatingStatus = false;
//   public isDeleting = false;
//   public processingPropertyId: number | null = null;
//   public isLoadingDetails = false; // Add loading state for details modal

//   // Form data for status updates
//   public statusUpdateForm = {
//     status: '' as 'active' | 'rejected' | 'suspended',
//     adminNotes: ''
//   };

//   // Form data for soft delete
//   public deleteForm = {
//     adminNotes: ''
//   };

//   constructor(private propertyService: PropertyService, private cdr: ChangeDetectorRef) {}

//   ngOnInit(): void {
//     this.loadProperties();
//   }

//   /**
//    * Load all properties from the API
//    */
//   loadProperties(): void {
//     console.log(' Starting to load properties...');
//     this.isLoading = true;
//     this.errorMessage = null;

//     this.propertyService.getAllProperties().subscribe({
//       next: (properties: AdminPropertyListDto[]) => {
//         console.log(' Raw properties from API:', properties);
//         console.log('Number of properties:', properties.length);

//         // Log each property's details for debugging
//         properties.forEach((prop, index) => {
//           console.log(`Property ${index + 1}:`, {
//             id: prop.id,
//             title: prop.title,
//             status: prop.status,
//             statusType: typeof prop.status,
//             city: prop.city,
//             country: prop.country,
//             hostName: prop.hostName,
//             hostEmail: prop.hostEmail,
//             pricePerNight: prop.pricePerNight,
//             images: prop.images?.length || 0,
//             averageRating: prop.averageRating,
//             bookingsCount: prop.bookingsCount
//           });
//         });

//         this.allProperties = properties;
//         this.filterProperties();

//         console.log(' After filtering:');
//         console.log('  Pending properties:', this.pendingProperties.length);
//         console.log('  Approved properties:', this.approvedProperties.length);
//         console.log('  Current section:', this.currentSection);

//         this.isLoading = false;
//         this.isUpdatingStatus = false;
//         this.processingPropertyId = null;
//         this.cdr.detectChanges();
//       },
//       error: (err) => {
//         console.error('Failed to load properties:', err);
//         this.errorMessage = err.message || 'Could not load properties. Please try again later.';
//         this.isLoading = false;
//         this.isUpdatingStatus = false;
//         this.processingPropertyId = null;
//         this.cdr.detectChanges();
//       },
//     });
//   }

//   /**
//    * Filter properties into pending and approved arrays
//    */
//   private filterProperties(): void {
//     console.log(' Starting to filter properties...');
//     console.log('All properties before filtering:', this.allProperties.length);

//     // Check each property's status
//     this.allProperties.forEach(prop => {
//       console.log(`Property "${prop.title}" status: "${prop.status}" (type: ${typeof prop.status})`);
//     });

//     // Filter pending properties (pending only - rejected properties are now suspended)
//     this.pendingProperties = this.allProperties.filter(p => {
//       const isPending = p.status === 'pending';
//       console.log(`Property "${p.title}" - isPending: ${isPending} (status: ${p.status})`);
//       return isPending;
//     });

//     // Filter approved properties (active and suspended - includes rejected properties)
//     this.approvedProperties = this.allProperties.filter(p => {
//       const isApproved = p.status === 'active' || p.status === 'suspended';
//       console.log(`Property "${p.title}" - isApproved: ${isApproved} (status: ${p.status})`);
//       return isApproved;
//     });

//     console.log(' Filtering complete:');
//     console.log('  - Pending:', this.pendingProperties.length);
//     console.log('  - Approved:', this.approvedProperties.length);
//   }

//   /**
//    * Set the current section view
//    */
//   setSection(section: 'unverified-properties' | 'verified-properties'): void {
//     console.log(' Switching section to:', section);
//     this.currentSection = section;
//   }

//   /**
//    * Update property status with admin notes
//    */
//   updateStatus(id: number, status: 'active' | 'rejected' | 'suspended', adminNotes?: string, autoRefresh: boolean = false): void {
//     console.log(' Starting status update:', { id, status, adminNotes, autoRefresh });

//     // Clear any previous error messages
//     this.errorMessage = null;
//     this.isUpdatingStatus = true;
//     this.processingPropertyId = id;

//     // Find the property before updating to log its current state
//     const property = this.allProperties.find(p => p.id === id);
//     if (!property) {
//       console.error(' Property not found in local array:', id);
//       this.errorMessage = `Property with ID ${id} not found.`;
//       this.isUpdatingStatus = false;
//       this.processingPropertyId = null;
//       return;
//     }

//     console.log(' Property before update:', {
//       id: property.id,
//       title: property.title,
//       currentStatus: property.status,
//       newStatus: status
//     });

//     const payload: PropertyStatusUpdateDto = {
//       status,
//       adminNotes: adminNotes || `Status changed to ${status} by admin`
//     };

//     console.log(' Sending payload:', payload);

//     this.propertyService.updatePropertyStatus(id, payload).subscribe({
//       next: (response) => {
//         console.log('✅ Status update successful:', response);

//         if (autoRefresh) {
//           console.log(' Auto-refreshing properties after status update...');
//           // Refresh the entire properties list from the server
//           this.loadProperties();
//         } else {
//           // Update the property status in the local array
//           const propertyIndex = this.allProperties.findIndex(p => p.id === id);
//           if (propertyIndex !== -1) {
//             const oldStatus = this.allProperties[propertyIndex].status;
//             this.allProperties[propertyIndex].status = status;

//             console.log(' Updated property status locally:', {
//               propertyId: id,
//               oldStatus,
//               newStatus: status
//             });

//             // Re-filter to move the property to the correct section
//             this.filterProperties();
//             this.cdr.detectChanges();

//             console.log(' Property moved between sections successfully');
//           } else {
//             console.error(' Could not find property to update in local array');
//           }

//           this.isUpdatingStatus = false;
//           this.processingPropertyId = null;
//         }
//       },
//       error: (error) => {
//         console.error(' Failed to update status:', error);
//         this.errorMessage = error.message || `Failed to update property status.`;
//         this.isUpdatingStatus = false;
//         this.processingPropertyId = null;
//         this.cdr.detectChanges();
//       },
//     });
//   }

//   /**
//    * Quick status update methods for buttons
//    */
//   approveProperty(property: AdminPropertyListDto): void {
//     this.updateStatus(property.id, 'active', `Property "${property.title}" approved by admin`, false);
//   }

//   /**
//    * Reject property now sets status to 'suspended' instead of 'rejected'
//    */
//   rejectProperty(property: AdminPropertyListDto): void {
//     console.log(' Rejecting property - setting status to suspended');
//     this.updateStatus(property.id, 'suspended', `Property "${property.title}" rejected and suspended by admin`, true);
//   }

//   suspendProperty(property: AdminPropertyListDto): void {
//     console.log(' Suspending property with auto-refresh');
//     this.updateStatus(property.id, 'suspended', `Property "${property.title}" suspended by admin`, true);
//   }

//   activateProperty(property: AdminPropertyListDto): void {
//     console.log(' Activating property with auto-refresh');
//     this.updateStatus(property.id, 'active', `Property "${property.title}" reactivated by admin`, true);
//   }

//   /**
//    * Open delete confirmation modal
//    */
//   openDeleteModal(property: AdminPropertyListDto): void {
//     console.log(' Opening delete modal for property:', property.id);
//     this.propertyToDelete = property;
//     this.isDeleteModalOpen = true;
//     this.deleteForm.adminNotes = `Property "${property.title}" suspended by admin`;
//   }

//   /**
//    * Close delete confirmation modal
//    */
//   closeDeleteModal(): void {
//     console.log(' Closing delete modal');
//     this.isDeleteModalOpen = false;
//     this.propertyToDelete = null;
//     this.deleteForm.adminNotes = '';
//   }

//   /**
//    * Confirm soft delete (suspend) property
//    */
//   confirmDelete(): void {
//     if (!this.propertyToDelete) {
//       console.error(' No property selected for deletion');
//       return;
//     }

//     const propertyId = this.propertyToDelete.id;
//     const propertyTitle = this.propertyToDelete.title;

//     console.log(' Starting property soft deletion with auto-refresh:', { propertyId, propertyTitle });

//     // Clear any previous error messages
//     this.errorMessage = null;
//     this.isDeleting = true;

//     this.propertyService.softDeleteProperty(propertyId, this.deleteForm.adminNotes).subscribe({
//       next: (response) => {
//         console.log(' Property soft deletion successful:', response);

//         // Close modal first
//         this.closeDeleteModal();

//         // Auto-refresh the properties list to get the latest data from server
//         console.log(' Auto-refreshing properties after soft delete...');
//         this.loadProperties();
//       },
//       error: (error) => {
//         console.error(' Failed to soft delete property:', error);
//         this.errorMessage = error.message || `Failed to suspend property.`;
//         this.closeDeleteModal();
//         this.isDeleting = false;
//         this.cdr.detectChanges();
//       },
//     });
//   }

//   /**
//    * UPDATED: Open details modal and fetch detailed property information
//    */
//   openDetailsModal(property: AdminPropertyListDto): void {
//     console.log(' Opening details modal for property:', property.id);

//     // Show the modal immediately with basic info
//     this.isDetailsModalOpen = true;
//     this.isLoadingDetails = true;
//     this.propertyToView = null;
//     this.errorMessage = null;

//     // Fetch detailed property information from the Property controller
//     this.propertyService.getPropertyDetails(property.id).subscribe({
//       next: (detailedProperty: PropertyDetailDto) => {
//         console.log(' Successfully fetched detailed property information:', detailedProperty);
//         this.propertyToView = detailedProperty;
//         this.isLoadingDetails = false;
//         this.cdr.detectChanges();
//       },
//       error: (error) => {
//         console.error(' Failed to fetch detailed property information:', error);
//         // Fallback to basic property information if detailed fetch fails
//         this.propertyToView = {
//           ...property,
//           numberOfBedrooms: undefined,
//           numberOfBathrooms: undefined,
//           maxGuests: undefined,
//           amenities: [],
//           totalReviews: undefined,
//           isAvailable: undefined
//         } as PropertyDetailDto;

//         this.errorMessage = `Could not load detailed information: ${error.message}`;
//         this.isLoadingDetails = false;
//         this.cdr.detectChanges();
//       }
//     });
//   }

//   /**
//    * Close details modal
//    */
//   closeDetailsModal(): void {
//     console.log(' Closing details modal');
//     this.isDetailsModalOpen = false;
//     this.propertyToView = null;
//     this.isLoadingDetails = false;
//     this.errorMessage = null;
//   }

//   /**
//    * Get property image URL with fallback
//    */
//   getPropertyImageUrl(property: AdminPropertyListDto): string {
//     console.log(` Getting image for property "${property.title}":`, property.images);

//     if (!property.images || property.images.length === 0) {
//       console.log('No images found, using placeholder');
//       return 'https://placehold.co/400x300/e0e0e0/777?text=No+Image';
//     }

//     // Find cover image or use first available image
//     const coverImage = property.images.find(img => img.isCover);
//     const selectedImage = coverImage || property.images[0];
//     const imageUrl = selectedImage?.imageUrl || 'https://placehold.co/400x300/e0e0e0/777?text=No+Image';

//     console.log('Selected image URL:', imageUrl);
//     return imageUrl;
//   }

//   /**
//    * Handle image loading errors
//    */
//   onImageError(event: Event): void {
//     console.log(' Image loading error occurred');
//     (event.target as HTMLImageElement).src = 'https://placehold.co/400x300/e0e0e0/777?text=Invalid+Image';
//   }

//   /**
//    * Check if a property is currently being processed
//    */
//   isProcessingProperty(propertyId: number): boolean {
//     return this.processingPropertyId === propertyId && (this.isUpdatingStatus || this.isDeleting);
//   }

//   /**
//    * Refresh properties data
//    */
//   refreshProperties(): void {
//     console.log(' Refreshing properties data...');
//     this.loadProperties();
//   }

//   /**
//    * Get status display text
//    */
//   getStatusDisplayText(status: string): string {
//     switch (status) {
//       case 'pending': return 'Pending Review';
//       case 'active': return 'Active';
//       case 'rejected': return 'Rejected';
//       case 'suspended': return 'Suspended';
//       default: return status;
//     }
//   }

//   /**
//    * Get status icon
//    */
//   getStatusIcon(status: string): string {
//     switch (status) {
//       case 'pending': return '⏳';
//       case 'active': return '✅';
//       case 'rejected': return '❌';
//       case 'suspended': return '⏸️';
//       default: return '❓';
//     }
//   }
// }



import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PropertyService } from '../../../Services/property.service';
import {
  AdminPropertyListDto,
  AdminPropertyResponseDto,
  PropertyStatusUpdateDto,
  PropertySoftDeleteDto,
  PropertyDetailDto
} from '../../../Models/Property.model';

@Component({
  selector: 'app-admin-property-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-property-management.html',
  styleUrls: ['./admin-property-management.css'],
})
export class PropertyManagementComponent implements OnInit {
  // Component State
  public allProperties: AdminPropertyListDto[] = [];
  public pendingProperties: AdminPropertyListDto[] = [];
  public approvedProperties: AdminPropertyListDto[] = [];
  public currentSection: 'unverified-properties' | 'verified-properties' = 'unverified-properties';

  // UI State
  public isLoading = true;
  public errorMessage: string | null = null;
  public isDetailsModalOpen = false;
  public isDeleteModalOpen = false;
  public propertyToView: PropertyDetailDto | null = null;
  public propertyToDelete: AdminPropertyListDto | null = null;
  public isUpdatingStatus = false;
  public isDeleting = false;
  public processingPropertyId: number | null = null;
  public isLoadingDetails = false;

  // Form data
  public statusUpdateForm = {
    status: '' as 'pending' | 'active' | 'rejected' | 'suspended', // Added 'pending'
    adminNotes: ''
  };

  public deleteForm = {
    adminNotes: ''
  };

  constructor(private propertyService: PropertyService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadProperties();
  }

  /**
   * ENHANCED: Load all properties with detailed debugging
   */
  loadProperties(): void {
    console.log('🏠 ===== STARTING PROPERTY LOAD =====');
    console.log('Current timestamp:', new Date().toISOString());
    
    this.isLoading = true;
    this.errorMessage = null;

    this.propertyService.getAllProperties().subscribe({
      next: (properties: AdminPropertyListDto[]) => {
        console.log('✅ ===== RAW API RESPONSE =====');
        console.log('Total properties received:', properties.length);
        console.log('Raw response:', properties);
        
        // Enhanced property logging
        properties.forEach((prop, index) => {
          console.log(`📋 Property ${index + 1} Details:`);
          console.log('  - ID:', prop.id);
          console.log('  - Title:', prop.title);
          console.log('  - Status:', `"${prop.status}"` , '(Type:', typeof prop.status, ')');
          console.log('  - Status Length:', prop.status?.length);
          console.log('  - Status Char Codes:', prop.status?.split('').map((c, i) => `${c}(${c.charCodeAt(0)})`));
          console.log('  - Host:', prop.hostName);
          console.log('  - Location:', `${prop.city}, ${prop.country}`);
          console.log('  - Price:', prop.pricePerNight);
          console.log('  - Images:', prop.images?.length || 0);
          console.log('  - Created:', prop.createdAt);
          console.log('  ---');
        });

        this.allProperties = properties;
        
        // Enhanced filtering with debug
        this.filterPropertiesWithDebug();

        console.log('🎯 ===== FINAL RESULTS =====');
        console.log('Pending properties:', this.pendingProperties.length);
        console.log('Approved properties:', this.approvedProperties.length);
        console.log('Current section:', this.currentSection);
        console.log('===== END PROPERTY LOAD =====');

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ ===== PROPERTY LOAD ERROR =====');
        console.error('Error object:', err);
        console.error('Error message:', err.message);
        console.error('Error stack:', err.stack);
        
        this.errorMessage = err.message || 'Could not load properties. Please try again later.';
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  /**
   * ENHANCED: Filter properties with extensive debugging
   */
  private filterPropertiesWithDebug(): void {
    console.log('🔍 ===== STARTING PROPERTY FILTERING =====');
    console.log('All properties count:', this.allProperties.length);

    // Test all possible status variations
    const statusVariations = ['pending', 'Pending', 'PENDING', 'active', 'Active', 'ACTIVE', 'suspended', 'Suspended', 'SUSPENDED', 'rejected', 'Rejected', 'REJECTED'];
    
    statusVariations.forEach(variation => {
      const count = this.allProperties.filter(p => p.status === variation).length;
      if (count > 0) {
        console.log(`📊 Properties with status "${variation}":`, count);
      }
    });

    // Enhanced pending filter with debug
    console.log('🔍 Filtering PENDING properties...');
    this.pendingProperties = this.allProperties.filter(p => {
      const status = p.status;
      const isPending = status === 'pending';
      const isPendingCaseInsensitive = status?.toLowerCase() === 'pending';
      
      console.log(`Property "${p.title}":`, {
        id: p.id,
        status: `"${status}"`,
        statusType: typeof status,
        isPending,
        isPendingCaseInsensitive,
        willBeIncluded: isPending
      });
      
      return isPending;
    });

    // Enhanced approved filter with debug
    console.log('🔍 Filtering APPROVED properties...');
    this.approvedProperties = this.allProperties.filter(p => {
      const status = p.status;
      const isActive = status === 'active';
      const isSuspended = status === 'suspended';
      const isApproved = isActive || isSuspended;
      
      console.log(`Property "${p.title}":`, {
        id: p.id,
        status: `"${status}"`,
        isActive,
        isSuspended,
        isApproved,
        willBeIncluded: isApproved
      });
      
      return isApproved;
    });

    console.log('🎯 FILTERING RESULTS:');
    console.log('  - Pending properties:', this.pendingProperties.length);
    console.log('  - Approved properties:', this.approvedProperties.length);
    
    // List pending properties
    if (this.pendingProperties.length > 0) {
      console.log('📋 Pending Properties List:');
      this.pendingProperties.forEach((prop, i) => {
        console.log(`  ${i + 1}. "${prop.title}" (ID: ${prop.id}, Status: "${prop.status}")`);
      });
    } else {
      console.log('⚠️ NO PENDING PROPERTIES FOUND!');
      console.log('Possible reasons:');
      console.log('  1. Backend is not returning any pending properties');
      console.log('  2. Status field name is different (e.g., "propertyStatus" instead of "status")');
      console.log('  3. Status value is different (e.g., "Pending" with capital P)');
      console.log('  4. No properties in database have pending status');
      console.log('  5. Backend filters out pending properties');
    }
    
    console.log('===== END PROPERTY FILTERING =====');
  }

  /**
   * ENHANCED: Try alternative filtering methods
   */
  tryAlternativeFiltering(): void {
    console.log('🔧 ===== TRYING ALTERNATIVE FILTERING =====');
    
    // Try case-insensitive filtering
    const pendingCaseInsensitive = this.allProperties.filter(p => 
      p.status?.toLowerCase() === 'pending'
    );
    console.log('Case-insensitive pending count:', pendingCaseInsensitive.length);
    
    // Try partial match filtering
    const pendingPartialMatch = this.allProperties.filter(p => 
      p.status?.toLowerCase().includes('pend')
    );
    console.log('Partial match pending count:', pendingPartialMatch.length);
    
    // Try different property status field names
    const allPropertiesAsAny = this.allProperties as any[];
    const statusFields = ['status', 'propertyStatus', 'state', 'currentStatus', 'approvalStatus'];
    
    statusFields.forEach(field => {
      const count = allPropertiesAsAny.filter(p => p[field] === 'pending').length;
      if (count > 0) {
        console.log(`Found ${count} pending properties using field "${field}"`);
      }
    });
    
    console.log('===== END ALTERNATIVE FILTERING =====');
  }

  /**
   * ENHANCED: Manual status check method for debugging
   */
  debugPropertyStatuses(): void {
    console.log('🐛 ===== MANUAL STATUS DEBUG =====');
    
    if (this.allProperties.length === 0) {
      console.log('❌ No properties to debug - allProperties is empty');
      return;
    }
    
    // Check each property manually
    this.allProperties.forEach((prop, index) => {
      console.log(`🔍 Property ${index + 1} Debug:`);
      console.log('  Raw object:', prop);
      console.log('  Object keys:', Object.keys(prop));
      console.log('  Status field exists:', 'status' in prop);
      console.log('  Status value:', prop.status);
      console.log('  Status === "pending":', prop.status === 'pending');
      console.log('  Status === "active":', prop.status === 'active');
      console.log('  Status === "suspended":', prop.status === 'suspended');
      console.log('  Status === "rejected":', prop.status === 'rejected');
      
      // Check for non-visible characters
      if (prop.status) {
        const cleanStatus = prop.status.trim();
        console.log('  Trimmed status:', `"${cleanStatus}"`);
        console.log('  Status after trim === "pending":', cleanStatus === 'pending');
      }
      console.log('  ---');
    });
    
    console.log('===== END MANUAL STATUS DEBUG =====');
  }

  // Original methods with enhanced logging
  setSection(section: 'unverified-properties' | 'verified-properties'): void {
    console.log('🔄 Switching section to:', section);
    this.currentSection = section;
    
    // Call debug methods when switching to unverified
    if (section === 'unverified-properties' && this.pendingProperties.length === 0) {
      console.log('⚠️ No pending properties found, running debug checks...');
      this.tryAlternativeFiltering();
      this.debugPropertyStatuses();
    }
  }

  updateStatus(id: number, status: 'pending' | 'active' | 'rejected' | 'suspended', adminNotes?: string, autoRefresh: boolean = false): void {
    console.log('🔄 Starting status update:', { id, status, adminNotes, autoRefresh });
    
    this.errorMessage = null;
    this.isUpdatingStatus = true;
    this.processingPropertyId = id;

    const property = this.allProperties.find(p => p.id === id);
    if (!property) {
      console.error('❌ Property not found in local array:', id);
      this.errorMessage = `Property with ID ${id} not found.`;
      this.isUpdatingStatus = false;
      this.processingPropertyId = null;
      return;
    }

    const payload: PropertyStatusUpdateDto = {
      status: status as 'pending' | 'active' | 'rejected' | 'suspended',
      adminNotes: adminNotes || `Status changed to ${status} by admin`
    };

    this.propertyService.updatePropertyStatus(id, payload).subscribe({
      next: (response) => {
        console.log('✅ Status update successful:', response);
        
        if (autoRefresh) {
          this.loadProperties();
        } else {
          const propertyIndex = this.allProperties.findIndex(p => p.id === id);
          if (propertyIndex !== -1) {
            this.allProperties[propertyIndex].status = status;
            this.filterPropertiesWithDebug();
            this.cdr.detectChanges();
          }
          this.isUpdatingStatus = false;
          this.processingPropertyId = null;
        }
      },
      error: (error) => {
        console.error('❌ Failed to update status:', error);
        this.errorMessage = error.message || `Failed to update property status.`;
        this.isUpdatingStatus = false;
        this.processingPropertyId = null;
        this.cdr.detectChanges();
      },
    });
  }

  // Keep all your existing methods...
  approveProperty(property: AdminPropertyListDto): void {
    this.updateStatus(property.id, 'active', `Property "${property.title}" approved by admin`, false);
  }

  rejectProperty(property: AdminPropertyListDto): void {
    this.updateStatus(property.id, 'suspended', `Property "${property.title}" rejected and suspended by admin`, true);
  }

  suspendProperty(property: AdminPropertyListDto): void {
    this.updateStatus(property.id, 'suspended', `Property "${property.title}" suspended by admin`, true);
  }

  activateProperty(property: AdminPropertyListDto): void {
    this.updateStatus(property.id, 'active', `Property "${property.title}" reactivated by admin`, true);
  }

  openDeleteModal(property: AdminPropertyListDto): void {
    this.propertyToDelete = property;
    this.isDeleteModalOpen = true;
    this.deleteForm.adminNotes = `Property "${property.title}" suspended by admin`;
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen = false;
    this.propertyToDelete = null;
    this.deleteForm.adminNotes = '';
  }

  confirmDelete(): void {
    if (!this.propertyToDelete) return;

    const propertyId = this.propertyToDelete.id;
    this.errorMessage = null;
    this.isDeleting = true;

    this.propertyService.softDeleteProperty(propertyId, this.deleteForm.adminNotes).subscribe({
      next: (response) => {
        console.log('✅ Property soft deletion successful:', response);
        this.closeDeleteModal();
        this.loadProperties();
      },
      error: (error) => {
        console.error('❌ Failed to soft delete property:', error);
        this.errorMessage = error.message || `Failed to suspend property.`;
        this.closeDeleteModal();
        this.isDeleting = false;
        this.cdr.detectChanges();
      },
    });
  }

  openDetailsModal(property: AdminPropertyListDto): void {
    this.isDetailsModalOpen = true;
    this.isLoadingDetails = true;
    this.propertyToView = null;
    this.errorMessage = null;

    this.propertyService.getPropertyDetails(property.id).subscribe({
      next: (detailedProperty: PropertyDetailDto) => {
        this.propertyToView = detailedProperty;
        this.isLoadingDetails = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.propertyToView = {
          ...property,
          numberOfBedrooms: undefined,
          numberOfBathrooms: undefined,
          maxGuests: undefined,
          amenities: [],
          totalReviews: undefined,
          isAvailable: undefined
        } as PropertyDetailDto;

        this.errorMessage = `Could not load detailed information: ${error.message}`;
        this.isLoadingDetails = false;
        this.cdr.detectChanges();
      }
    });
  }

  closeDetailsModal(): void {
    this.isDetailsModalOpen = false;
    this.propertyToView = null;
    this.isLoadingDetails = false;
    this.errorMessage = null;
  }

  getPropertyImageUrl(property: AdminPropertyListDto): string {
    if (!property.images || property.images.length === 0) {
      return 'https://placehold.co/400x300/e0e0e0/777?text=No+Image';
    }
    const coverImage = property.images.find(img => img.isCover);
    const selectedImage = coverImage || property.images[0];
    return selectedImage?.imageUrl || 'https://placehold.co/400x300/e0e0e0/777?text=No+Image';
  }

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = 'https://placehold.co/400x300/e0e0e0/777?text=Invalid+Image';
  }

  isProcessingProperty(propertyId: number): boolean {
    return this.processingPropertyId === propertyId && (this.isUpdatingStatus || this.isDeleting);
  }

  refreshProperties(): void {
    this.loadProperties();
  }

  getStatusDisplayText(status: string): string {
    switch (status) {
      case 'pending': return 'Pending Review';
      case 'active': return 'Active';
      case 'rejected': return 'Rejected';
      case 'suspended': return 'Suspended';
      default: return status;
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'pending': return '⏳';
      case 'active': return '✅';
      case 'rejected': return '❌';
      case 'suspended': return '⏸️';
      default: return '❓';
    }
  }
}