import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PropertyService } from '../../../Services/property.service';
import { 
  AdminPropertyListDto, 
  AdminPropertyResponseDto, 
  PropertyStatusUpdateDto, 
  PropertySoftDeleteDto,
  PropertyDetailDto // Add the new interface
} from '../../../Models/Property.model';

@Component({
  selector: 'app-admin-property-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-property-management.html',
  styleUrls: ['./admin-property-management.css'],
})
export class PropertyManagementComponent implements OnInit {
  // Component State - Using the new DTOs
  public allProperties: AdminPropertyListDto[] = [];
  public pendingProperties: AdminPropertyListDto[] = [];
  public approvedProperties: AdminPropertyListDto[] = [];
  public currentSection: 'unverified-properties' | 'verified-properties' = 'unverified-properties';
  
  // UI State
  public isLoading = true;
  public errorMessage: string | null = null;
  public isDetailsModalOpen = false;
  public isDeleteModalOpen = false;
  public propertyToView: PropertyDetailDto | null = null; // Changed to PropertyDetailDto
  public propertyToDelete: AdminPropertyListDto | null = null;

  // Add loading states for individual operations
  public isUpdatingStatus = false;
  public isDeleting = false;
  public processingPropertyId: number | null = null;
  public isLoadingDetails = false; // Add loading state for details modal

  // Form data for status updates
  public statusUpdateForm = {
    status: '' as 'active' | 'rejected' | 'suspended',
    adminNotes: ''
  };

  // Form data for soft delete
  public deleteForm = {
    adminNotes: ''
  };

  constructor(private propertyService: PropertyService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadProperties();
  }

  /**
   * Load all properties from the API
   */
  loadProperties(): void {
    console.log('🔄 Starting to load properties...');
    this.isLoading = true;
    this.errorMessage = null;
    
    this.propertyService.getAllProperties().subscribe({
      next: (properties: AdminPropertyListDto[]) => {
        console.log('✅ Raw properties from API:', properties);
        console.log('📊 Number of properties:', properties.length);
        
        // Log each property's details for debugging
        properties.forEach((prop, index) => {
          console.log(`Property ${index + 1}:`, {
            id: prop.id,
            title: prop.title,
            status: prop.status,
            statusType: typeof prop.status,
            city: prop.city,
            country: prop.country,
            hostName: prop.hostName,
            hostEmail: prop.hostEmail,
            pricePerNight: prop.pricePerNight,
            images: prop.images?.length || 0,
            averageRating: prop.averageRating,
            bookingsCount: prop.bookingsCount
          });
        });

        this.allProperties = properties;
        this.filterProperties();
        
        console.log('📋 After filtering:');
        console.log('  - Pending properties:', this.pendingProperties.length);
        console.log('  - Approved properties:', this.approvedProperties.length);
        console.log('  - Current section:', this.currentSection);
        
        this.isLoading = false;
        this.isUpdatingStatus = false;
        this.processingPropertyId = null;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Failed to load properties:', err);
        this.errorMessage = err.message || 'Could not load properties. Please try again later.';
        this.isLoading = false;
        this.isUpdatingStatus = false;
        this.processingPropertyId = null;
        this.cdr.detectChanges();
      },
    });
  }

  /**
   * Filter properties into pending and approved arrays
   */
  private filterProperties(): void {
    console.log('🔍 Starting to filter properties...');
    console.log('All properties before filtering:', this.allProperties.length);
    
    // Check each property's status
    this.allProperties.forEach(prop => {
      console.log(`Property "${prop.title}" status: "${prop.status}" (type: ${typeof prop.status})`);
    });
    
    // Filter pending properties (pending only - rejected properties are now suspended)
    this.pendingProperties = this.allProperties.filter(p => {
      const isPending = p.status === 'pending';
      console.log(`Property "${p.title}" - isPending: ${isPending} (status: ${p.status})`);
      return isPending;
    });
    
    // Filter approved properties (active and suspended - includes rejected properties)
    this.approvedProperties = this.allProperties.filter(p => {
      const isApproved = p.status === 'active' || p.status === 'suspended';
      console.log(`Property "${p.title}" - isApproved: ${isApproved} (status: ${p.status})`);
      return isApproved;
    });
    
    console.log('✅ Filtering complete:');
    console.log('  - Pending:', this.pendingProperties.length);
    console.log('  - Approved:', this.approvedProperties.length);
  }

  /**
   * Set the current section view
   */
  setSection(section: 'unverified-properties' | 'verified-properties'): void {
    console.log('📌 Switching section to:', section);
    this.currentSection = section;
  }

  /**
   * Update property status with admin notes
   */
  updateStatus(id: number, status: 'active' | 'rejected' | 'suspended', adminNotes?: string, autoRefresh: boolean = false): void {
    console.log('🔄 Starting status update:', { id, status, adminNotes, autoRefresh });
    
    // Clear any previous error messages
    this.errorMessage = null;
    this.isUpdatingStatus = true;
    this.processingPropertyId = id;
    
    // Find the property before updating to log its current state
    const property = this.allProperties.find(p => p.id === id);
    if (!property) {
      console.error('❌ Property not found in local array:', id);
      this.errorMessage = `Property with ID ${id} not found.`;
      this.isUpdatingStatus = false;
      this.processingPropertyId = null;
      return;
    }
    
    console.log('📝 Property before update:', {
      id: property.id,
      title: property.title,
      currentStatus: property.status,
      newStatus: status
    });

    const payload: PropertyStatusUpdateDto = { 
      status,
      adminNotes: adminNotes || `Status changed to ${status} by admin`
    };
    
    console.log('📤 Sending payload:', payload);
    
    this.propertyService.updatePropertyStatus(id, payload).subscribe({
      next: (response) => {
        console.log('✅ Status update successful:', response);
        
        if (autoRefresh) {
          console.log('🔄 Auto-refreshing properties after status update...');
          // Refresh the entire properties list from the server
          this.loadProperties();
        } else {
          // Update the property status in the local array
          const propertyIndex = this.allProperties.findIndex(p => p.id === id);
          if (propertyIndex !== -1) {
            const oldStatus = this.allProperties[propertyIndex].status;
            this.allProperties[propertyIndex].status = status;
            
            console.log('🔄 Updated property status locally:', {
              propertyId: id,
              oldStatus,
              newStatus: status
            });
            
            // Re-filter to move the property to the correct section
            this.filterProperties();
            this.cdr.detectChanges();
            
            console.log('✅ Property moved between sections successfully');
          } else {
            console.error('❌ Could not find property to update in local array');
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

  /**
   * Quick status update methods for buttons
   */
  approveProperty(property: AdminPropertyListDto): void {
    this.updateStatus(property.id, 'active', `Property "${property.title}" approved by admin`, false);
  }

  /**
   * Reject property now sets status to 'suspended' instead of 'rejected'
   */
  rejectProperty(property: AdminPropertyListDto): void {
    console.log('❌ Rejecting property - setting status to suspended');
    this.updateStatus(property.id, 'suspended', `Property "${property.title}" rejected and suspended by admin`, true);
  }

  suspendProperty(property: AdminPropertyListDto): void {
    console.log('⏸️ Suspending property with auto-refresh');
    this.updateStatus(property.id, 'suspended', `Property "${property.title}" suspended by admin`, true);
  }

  activateProperty(property: AdminPropertyListDto): void {
    console.log('▶️ Activating property with auto-refresh');
    this.updateStatus(property.id, 'active', `Property "${property.title}" reactivated by admin`, true);
  }

  /**
   * Open delete confirmation modal
   */
  openDeleteModal(property: AdminPropertyListDto): void {
    console.log('🗑️ Opening delete modal for property:', property.id);
    this.propertyToDelete = property;
    this.isDeleteModalOpen = true;
    this.deleteForm.adminNotes = `Property "${property.title}" suspended by admin`;
  }

  /**
   * Close delete confirmation modal
   */
  closeDeleteModal(): void {
    console.log('❌ Closing delete modal');
    this.isDeleteModalOpen = false;
    this.propertyToDelete = null;
    this.deleteForm.adminNotes = '';
  }

  /**
   * Confirm soft delete (suspend) property
   */
  confirmDelete(): void {
    if (!this.propertyToDelete) {
      console.error('❌ No property selected for deletion');
      return;
    }

    const propertyId = this.propertyToDelete.id;
    const propertyTitle = this.propertyToDelete.title;
    
    console.log('🗑️ Starting property soft deletion with auto-refresh:', { propertyId, propertyTitle });
    
    // Clear any previous error messages
    this.errorMessage = null;
    this.isDeleting = true;

    this.propertyService.softDeleteProperty(propertyId, this.deleteForm.adminNotes).subscribe({
      next: (response) => {
        console.log('✅ Property soft deletion successful:', response);
        
        // Close modal first
        this.closeDeleteModal();
        
        // Auto-refresh the properties list to get the latest data from server
        console.log('🔄 Auto-refreshing properties after soft delete...');
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

  /**
   * UPDATED: Open details modal and fetch detailed property information
   */
  openDetailsModal(property: AdminPropertyListDto): void {
    console.log('📋 Opening details modal for property:', property.id);
    
    // Show the modal immediately with basic info
    this.isDetailsModalOpen = true;
    this.isLoadingDetails = true;
    this.propertyToView = null;
    this.errorMessage = null;
    
    // Fetch detailed property information from the Property controller
    this.propertyService.getPropertyDetails(property.id).subscribe({
      next: (detailedProperty: PropertyDetailDto) => {
        console.log('✅ Successfully fetched detailed property information:', detailedProperty);
        this.propertyToView = detailedProperty;
        this.isLoadingDetails = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('❌ Failed to fetch detailed property information:', error);
        // Fallback to basic property information if detailed fetch fails
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

  /**
   * Close details modal
   */
  closeDetailsModal(): void {
    console.log('❌ Closing details modal');
    this.isDetailsModalOpen = false;
    this.propertyToView = null;
    this.isLoadingDetails = false;
    this.errorMessage = null;
  }

  /**
   * Get property image URL with fallback
   */
  getPropertyImageUrl(property: AdminPropertyListDto): string {
    console.log(`🖼️ Getting image for property "${property.title}":`, property.images);
    
    if (!property.images || property.images.length === 0) {
      console.log('No images found, using placeholder');
      return 'https://placehold.co/400x300/e0e0e0/777?text=No+Image';
    }
    
    // Find cover image or use first available image
    const coverImage = property.images.find(img => img.isCover);
    const selectedImage = coverImage || property.images[0];
    const imageUrl = selectedImage?.imageUrl || 'https://placehold.co/400x300/e0e0e0/777?text=No+Image';
    
    console.log('Selected image URL:', imageUrl);
    return imageUrl;
  }

  /**
   * Handle image loading errors
   */
  onImageError(event: Event): void {
    console.log('🚫 Image loading error occurred');
    (event.target as HTMLImageElement).src = 'https://placehold.co/400x300/e0e0e0/777?text=Invalid+Image';
  }

  /**
   * Check if a property is currently being processed
   */
  isProcessingProperty(propertyId: number): boolean {
    return this.processingPropertyId === propertyId && (this.isUpdatingStatus || this.isDeleting);
  }

  /**
   * Refresh properties data
   */
  refreshProperties(): void {
    console.log('🔄 Refreshing properties data...');
    this.loadProperties();
  }

  /**
   * Get status display text
   */
  getStatusDisplayText(status: string): string {
    switch (status) {
      case 'pending': return 'Pending Review';
      case 'active': return 'Active';
      case 'rejected': return 'Rejected';
      case 'suspended': return 'Suspended';
      default: return status;
    }
  }

  /**
   * Get status icon
   */
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