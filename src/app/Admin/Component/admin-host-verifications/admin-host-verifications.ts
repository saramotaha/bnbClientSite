import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil, debounceTime, distinctUntilChanged, interval, switchMap, merge, EMPTY, timer, of, finalize } from 'rxjs';
import { 
  HostVerification,
  AdminHostVerificationResponseDto,
  VerificationFilters,
  VerificationStatus,
  DocumentViewData 
} from '../../Models/admin-host-verification.model';
import { HostVerificationService } from '../../Services/admin-host-verification.service';

@Component({
  selector: 'app-host-verification',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-host-verifications.html',
  styleUrls: ['./admin-host-verifications.css']
})
export class AdminHostVerificationComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private refreshTrigger$ = new Subject<void>();
  public autoRefreshInterval = 30000; // Default to 30 seconds
  public isPageVisible = true;
  
  // Data properties - Updated to use AdminHostVerificationResponseDto
  verifications: AdminHostVerificationResponseDto[] = [];
  filteredVerifications: AdminHostVerificationResponseDto[] = [];
  selectedVerification: AdminHostVerificationResponseDto | null = null;
  
  // UI state
  isLoading = false;
  isLoadingDetail = false;
  showFilters = false;
  showDetailModal = false;
  showApprovalModal = false;
  showRejectionModal = false;
  showDocumentModal = false;
  
  // Auto-refresh state
  autoRefreshEnabled = true;
  lastRefreshTime = new Date();
  nextRefreshCountdown = this.autoRefreshInterval / 1000;
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  
  // Forms
  filterForm!: FormGroup;
  approvalForm!: FormGroup;
  rejectionForm!: FormGroup;
  
  // Document viewing
  selectedDocuments: { doc1: DocumentViewData | null, doc2: DocumentViewData | null } = { doc1: null, doc2: null };
  
  // Filter options
  statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
  ];
  
  verificationTypeOptions = [
    { value: '', label: 'All Types' },
    { value: 'government_id', label: 'Government ID' },
    { value: 'passport', label: 'Passport' },
    { value: 'drivers_license', label: 'Driver\'s License' },
    { value: 'other', label: 'Other' }
  ];

  constructor(
    private hostVerificationService: HostVerificationService,
    private fb: FormBuilder
  ) {
    this.initializeForms();
    this.setupPageVisibilityListener();
  }

  ngOnInit(): void {
    this.setupAutoRefresh();
    this.setupFilterSubscription();
    this.startCountdownTimer();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // private initializeForms(): void {
  //   this.filterForm = this.fb.group({
  //     status: [''],
  //     hostId: [''],
  //     verificationType: [''],
  //     dateFrom: [''],
  //     dateTo: [''],
  //     searchTerm: ['']
  //   });

  //   this.approvalForm = this.fb.group({
  //     adminNotes: ['']
  //   });

  //   this.rejectionForm = this.fb.group({
  //     adminNotes: ['']
  //   });
  // }
  private initializeForms(): void {
  this.filterForm = this.fb.group({
    status: [''],
    hostId: [''],
    verificationType: [''],
    dateFrom: [''],
    dateTo: [''],
    searchTerm: ['']
  });

  // Approval form - admin notes are optional
  this.approvalForm = this.fb.group({
    adminNotes: [''] // No validators, completely optional
  });

  // Rejection form - admin notes are optional (remove required if you had it)
  this.rejectionForm = this.fb.group({
    adminNotes: [''] // No validators, completely optional
  });
}

  private setupPageVisibilityListener(): void {
    document.addEventListener('visibilitychange', () => {
      this.isPageVisible = !document.hidden;
      if (this.isPageVisible && this.autoRefreshEnabled) {
        this.refreshTrigger$.next();
      }
    });
  }

  private setupAutoRefresh(): void {
    const autoRefresh$ = interval(this.autoRefreshInterval).pipe(takeUntil(this.destroy$));
    const manualRefresh$ = this.refreshTrigger$.pipe(takeUntil(this.destroy$));

    const refreshStream$ = merge(of(0), autoRefresh$, manualRefresh$).pipe(
      switchMap(() => {
        if (!this.isPageVisible && !this.autoRefreshEnabled) {
          return EMPTY;
        }
        // Use the with-documents endpoint for better functionality
        return this.hostVerificationService.getAllVerificationsWithDocuments();
      }),
      takeUntil(this.destroy$)
    );

    refreshStream$.subscribe({
      next: (verifications) => {
        const previousCount = this.verifications.length;
        this.verifications = verifications;
        this.applyFilters();
        this.lastRefreshTime = new Date();
        
        if (verifications.length > previousCount) {
          this.onNewVerificationsDetected(verifications.length - previousCount);
        }
        
        this.nextRefreshCountdown = this.autoRefreshInterval / 1000;
      },
      error: (error) => console.error('Error during auto-refresh:', error)
    });
  }

  private startCountdownTimer(): void {
    timer(0, 1000).pipe(takeUntil(this.destroy$)).subscribe(() => {
      if (this.autoRefreshEnabled && this.nextRefreshCountdown > 0) {
        this.nextRefreshCountdown--;
      }
      if (this.nextRefreshCountdown <= 0) {
        this.nextRefreshCountdown = this.autoRefreshInterval / 1000;
      }
    });
  }

  private onNewVerificationsDetected(count: number): void {
    console.log(`${count} new verification(s) detected`);
  }

  private setupFilterSubscription(): void {
    this.filterForm.valueChanges
      .pipe(takeUntil(this.destroy$), debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.applyFilters();
      });
  }

  loadVerifications(): void {
    this.refreshTrigger$.next();
  }

  applyFilters(): void {
    const filters = this.filterForm.value;
    let filtered = [...this.verifications];

    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter(v => v.status.toLowerCase() === filters.status.toLowerCase());
    }

    // Apply host ID filter
    if (filters.hostId) {
      filtered = filtered.filter(v => v.hostId.toString().includes(filters.hostId));
    }

    // Apply verification type filter
    if (filters.verificationType) {
      filtered = filtered.filter(v => v.type?.toLowerCase() === filters.verificationType.toLowerCase());
    }

    // Apply date range filters
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filtered = filtered.filter(v => new Date(v.submittedAt) >= fromDate);
    }
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      filtered = filtered.filter(v => new Date(v.submittedAt) <= toDate);
    }

    // Apply search term filter
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(v => 
        (v.hostName && v.hostName.toLowerCase().includes(term)) ||
        (v.hostEmail && v.hostEmail.toLowerCase().includes(term)) ||
        v.id.toString().includes(term) ||
        v.hostId.toString().includes(term)
      );
    }

    this.filteredVerifications = filtered;
    this.totalItems = filtered.length;
    
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }
  }

  viewDetails(verification: AdminHostVerificationResponseDto): void {
    this.isLoadingDetail = true;
    this.showDetailModal = true;
    
    this.hostVerificationService.getVerificationByIdWithDocuments(verification.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (detail) => {
          this.selectedVerification = detail;
          this.isLoadingDetail = false;
        },
        error: (error) => {
          console.error('Error loading verification details:', error);
          this.isLoadingDetail = false;
          this.showDetailModal = false;
        }
      });
  }

  viewDocuments(verification: AdminHostVerificationResponseDto): void {
    this.selectedVerification = verification;
    this.prepareDocumentData(verification);
    this.showDocumentModal = true;
  }

  private prepareDocumentData(verification: AdminHostVerificationResponseDto): void {
    this.selectedDocuments = {
      doc1: verification.documentUrl1 ? {
        verificationId: verification.id,
        documentNumber: 1,
        fileName: verification.documentUrl1,
        fileUrl: this.hostVerificationService.getDocumentFileUrl(verification.id, 1),
        fullFileUrl: verification.documentUrl1Full,
        isImage: this.hostVerificationService.isImageFile(verification.documentUrl1),
        isPdf: this.hostVerificationService.isPdfFile(verification.documentUrl1),
        fileIcon: this.hostVerificationService.getFileIcon(verification.documentUrl1)
      } : null,
      doc2: verification.documentUrl2 ? {
        verificationId: verification.id,
        documentNumber: 2,
        fileName: verification.documentUrl2,
        fileUrl: this.hostVerificationService.getDocumentFileUrl(verification.id, 2),
        fullFileUrl: verification.documentUrl2Full,
        isImage: this.hostVerificationService.isImageFile(verification.documentUrl2),
        isPdf: this.hostVerificationService.isPdfFile(verification.documentUrl2),
        fileIcon: this.hostVerificationService.getFileIcon(verification.documentUrl2)
      } : null
    };
  }

  openApprovalModal(verification: AdminHostVerificationResponseDto): void {
    this.selectedVerification = verification;
    this.showApprovalModal = true;
    this.approvalForm.reset();
  }

  openRejectionModal(verification: AdminHostVerificationResponseDto): void {
    this.selectedVerification = verification;
    this.showRejectionModal = true;
    this.rejectionForm.reset();
  }

  // approveVerification(): void {
  //   if (!this.selectedVerification) return;

  //   const verificationToUpdate = this.selectedVerification;
  //   const adminNotes = this.approvalForm.value.adminNotes;
    
  //   // Find the original verification to enable rollback on error
  //   const originalVerification = { ...this.verifications.find(v => v.id === verificationToUpdate.id) } as AdminHostVerificationResponseDto;

  //   // --- OPTIMISTIC UI UPDATE & ANIMATION ---
  //   const verificationInMasterList = this.verifications.find(v => v.id === verificationToUpdate.id);
  //   const verificationInFilteredList = this.filteredVerifications.find(v => v.id === verificationToUpdate.id);

  //   // Helper to update local state and trigger animation
  //   const updateLocalState = (verification: AdminHostVerificationResponseDto) => {
  //       verification.status = VerificationStatus.Approved;
  //       verification.adminNotes = adminNotes;
  //       verification.verifiedAt = new Date();
  //       verification.isChangingStatus = true; // Start animation
  //   };

  //   if (verificationInMasterList) updateLocalState(verificationInMasterList);
  //   if (verificationInFilteredList) updateLocalState(verificationInFilteredList);
    
  //   this.closeModals();
    
  //   // Make API call and handle animation timing
  //   this.hostVerificationService.approveVerification(verificationToUpdate.id, adminNotes)
  //     .pipe(
  //         takeUntil(this.destroy$),
  //         finalize(() => {
  //             // Stop the animation after 2 seconds, regardless of API success or failure
  //             setTimeout(() => {
  //                 if (verificationInMasterList) verificationInMasterList.isChangingStatus = false;
  //                 if (verificationInFilteredList) verificationInFilteredList.isChangingStatus = false;
  //             }, 2000); // Duration matches CSS animation
  //         })
  //     )
  //     .subscribe({
  //       next: (response) => {
  //         console.log('Approval successful:', response);
  //         // Refresh data to get latest from server
  //         this.refreshTrigger$.next();
  //       },
  //       error: (error) => {
  //         console.error('Error approving verification:', error);
  //         // --- ROLLBACK ON ERROR ---
  //         if (originalVerification) {
  //           if (verificationInMasterList) Object.assign(verificationInMasterList, originalVerification);
  //           if (verificationInFilteredList) Object.assign(verificationInFilteredList, originalVerification);
  //         }
  //       }
  //     });
  // }

  // rejectVerification(): void {
  //   if (!this.selectedVerification) return;

  //   const verificationToUpdate = this.selectedVerification;
  //   const adminNotes = this.rejectionForm.value.adminNotes;
  //   const originalVerification = { ...this.verifications.find(v => v.id === verificationToUpdate.id) } as AdminHostVerificationResponseDto;
    
  //   const verificationInMasterList = this.verifications.find(v => v.id === verificationToUpdate.id);
  //   const verificationInFilteredList = this.filteredVerifications.find(v => v.id === verificationToUpdate.id);

  //   const updateLocalState = (verification: AdminHostVerificationResponseDto) => {
  //       verification.status = VerificationStatus.Rejected;
  //       verification.adminNotes = adminNotes;
  //       verification.verifiedAt = new Date();
  //       verification.isChangingStatus = true; // Start animation
  //   };

  //   if (verificationInMasterList) updateLocalState(verificationInMasterList);
  //   if (verificationInFilteredList) updateLocalState(verificationInFilteredList);
    
  //   this.closeModals();

  //   this.hostVerificationService.rejectVerification(verificationToUpdate.id, adminNotes)
  //     .pipe(
  //         takeUntil(this.destroy$),
  //         finalize(() => {
  //             // Stop the animation after 2 seconds
  //             setTimeout(() => {
  //                 if (verificationInMasterList) verificationInMasterList.isChangingStatus = false;
  //                 if (verificationInFilteredList) verificationInFilteredList.isChangingStatus = false;
  //             }, 2000); // Duration matches CSS animation
  //         })
  //     )
  //     .subscribe({
  //       next: (response) => {
  //         console.log('Rejection successful:', response);
  //         // Refresh data to get latest from server
  //         this.refreshTrigger$.next();
  //       },
  //       error: (error) => {
  //         console.error('Error rejecting verification:', error);
  //         if (originalVerification) {
  //           if (verificationInMasterList) Object.assign(verificationInMasterList, originalVerification);
  //           if (verificationInFilteredList) Object.assign(verificationInFilteredList, originalVerification);
  //         }
  //       }
  //     });
  // }
  approveVerification(): void {
  if (!this.selectedVerification) return;

  const verificationToUpdate = this.selectedVerification;
  // Get admin notes, defaulting to empty string if null/undefined
  const adminNotes = this.approvalForm.value.adminNotes || '';
  
  // Find the original verification to enable rollback on error
  const originalVerification = { ...this.verifications.find(v => v.id === verificationToUpdate.id) } as AdminHostVerificationResponseDto;

  // --- OPTIMISTIC UI UPDATE & ANIMATION ---
  const verificationInMasterList = this.verifications.find(v => v.id === verificationToUpdate.id);
  const verificationInFilteredList = this.filteredVerifications.find(v => v.id === verificationToUpdate.id);

  // Helper to update local state and trigger animation
  const updateLocalState = (verification: AdminHostVerificationResponseDto) => {
      verification.status = VerificationStatus.Approved;
      verification.adminNotes = adminNotes;
      verification.verifiedAt = new Date();
      verification.isChangingStatus = true; // Start animation
  };

  if (verificationInMasterList) updateLocalState(verificationInMasterList);
  if (verificationInFilteredList) updateLocalState(verificationInFilteredList);
  
  this.closeModals();
  
  // Make API call and handle animation timing
  this.hostVerificationService.approveVerification(verificationToUpdate.id, adminNotes)
    .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
            // Stop the animation after 2 seconds, regardless of API success or failure
            setTimeout(() => {
                if (verificationInMasterList) verificationInMasterList.isChangingStatus = false;
                if (verificationInFilteredList) verificationInFilteredList.isChangingStatus = false;
            }, 2000); // Duration matches CSS animation
        })
    )
    .subscribe({
      next: (response) => {
        console.log('Approval successful:', response);
        // Refresh data to get latest from server
        this.refreshTrigger$.next();
      },
      error: (error) => {
        console.error('Error approving verification:', error);
        // --- ROLLBACK ON ERROR ---
        if (originalVerification) {
          if (verificationInMasterList) Object.assign(verificationInMasterList, originalVerification);
          if (verificationInFilteredList) Object.assign(verificationInFilteredList, originalVerification);
        }
      }
    });
}

rejectVerification(): void {
  if (!this.selectedVerification) return;

  const verificationToUpdate = this.selectedVerification;
  // Get admin notes, defaulting to empty string if null/undefined
  const adminNotes = this.rejectionForm.value.adminNotes || '';
  const originalVerification = { ...this.verifications.find(v => v.id === verificationToUpdate.id) } as AdminHostVerificationResponseDto;
  
  const verificationInMasterList = this.verifications.find(v => v.id === verificationToUpdate.id);
  const verificationInFilteredList = this.filteredVerifications.find(v => v.id === verificationToUpdate.id);

  const updateLocalState = (verification: AdminHostVerificationResponseDto) => {
      verification.status = VerificationStatus.Rejected;
      verification.adminNotes = adminNotes;
      verification.verifiedAt = new Date();
      verification.isChangingStatus = true; // Start animation
  };

  if (verificationInMasterList) updateLocalState(verificationInMasterList);
  if (verificationInFilteredList) updateLocalState(verificationInFilteredList);
  
  this.closeModals();

  this.hostVerificationService.rejectVerification(verificationToUpdate.id, adminNotes)
    .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
            // Stop the animation after 2 seconds
            setTimeout(() => {
                if (verificationInMasterList) verificationInMasterList.isChangingStatus = false;
                if (verificationInFilteredList) verificationInFilteredList.isChangingStatus = false;
            }, 2000); // Duration matches CSS animation
        })
    )
    .subscribe({
      next: (response) => {
        console.log('Rejection successful:', response);
        // Refresh data to get latest from server
        this.refreshTrigger$.next();
      },
      error: (error) => {
        console.error('Error rejecting verification:', error);
        if (originalVerification) {
          if (verificationInMasterList) Object.assign(verificationInMasterList, originalVerification);
          if (verificationInFilteredList) Object.assign(verificationInFilteredList, originalVerification);
        }
      }
    });
}

  

  closeModals(): void {
    this.showDetailModal = false;
    this.showApprovalModal = false;
    this.showRejectionModal = false;
    this.showDocumentModal = false;
    this.selectedVerification = null;
    this.selectedDocuments = { doc1: null, doc2: null };
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  clearFilters(): void {
    this.filterForm.reset({
      status: '',
      hostId: '',
      verificationType: '',
      dateFrom: '',
      dateTo: '',
      searchTerm: ''
    });
  }

  toggleAutoRefresh(): void {
    this.autoRefreshEnabled = !this.autoRefreshEnabled;
    if (this.autoRefreshEnabled) {
      this.nextRefreshCountdown = this.autoRefreshInterval / 1000;
      this.refreshTrigger$.next();
    }
  }

  setRefreshInterval(seconds: number): void {
    this.autoRefreshInterval = seconds * 1000;
    this.nextRefreshCountdown = seconds;
  }

  forceRefresh(): void {
    this.refreshTrigger$.next();
  }

  exportToCSV(): void {
    const csvData = this.filteredVerifications.map(v => ({
      ID: v.id,
      'Host ID': v.hostId,
      'Host Name': v.hostName || 'N/A',
      'Host Email': v.hostEmail || 'N/A',
      Status: v.status,
      'Verification Type': v.type || 'N/A',
      'Submitted Date': new Date(v.submittedAt).toLocaleDateString(),
      'Verified Date': v.verifiedAt ? new Date(v.verifiedAt).toLocaleDateString() : 'N/A',
      'Admin Notes': v.adminNotes || '',
      'Document 1': v.documentUrl1 || '',
      'Document 2': v.documentUrl2 || ''
    }));
    this.downloadCSV(csvData, 'host-verifications.csv');
  }

  private downloadCSV(data: any[], filename: string): void {
    const csvContent = this.convertToCSV(data);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  private convertToCSV(data: any[]): string {
    if (!data.length) return '';
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ];
    return csvRows.join('\n');
  }

  // Document handling methods
  viewDocument(verificationId: number, documentNumber: number): void {
    this.hostVerificationService.viewDocumentInNewTab(verificationId, documentNumber);
  }

  downloadDocument(verificationId: number, documentNumber: number, fileName?: string): void {
    this.hostVerificationService.downloadDocument(verificationId, documentNumber, fileName)
      .subscribe({
        next: () => {
          console.log('Download completed');
        },
        error: (error) => {
          console.error('Download failed:', error);
        }
      });
  }

  isImageFile(fileName: string): boolean {
    return this.hostVerificationService.isImageFile(fileName);
  }

  isPdfFile(fileName: string): boolean {
    return this.hostVerificationService.isPdfFile(fileName);
  }

  getFileIcon(fileName: string): string {
    return this.hostVerificationService.getFileIcon(fileName);
  }

  // Pagination and UI helpers
  get paginatedVerifications(): AdminHostVerificationResponseDto[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredVerifications.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get pageNumbers(): number[] {
    const pages = [];
    const totalPages = this.totalPages;
    const currentPage = this.currentPage;
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  changeItemsPerPage(itemsPerPage: number): void {
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 1;
  }

  getStatusColor(status: string): string {
    return this.hostVerificationService.getStatusColor(status);
  }

  getStatusIcon(status: string): string {
    return this.hostVerificationService.getStatusIcon(status);
  }

  formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  }

  formatCountdown(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  trackByVerificationId(index: number, verification: AdminHostVerificationResponseDto): any {
    return verification.id;
  }

  get refreshStatusText(): string {
    if (!this.autoRefreshEnabled) return 'Auto-refresh disabled';
    if (!this.isPageVisible) return 'Paused (page not visible)';
    return `Next refresh in ${this.formatCountdown(this.nextRefreshCountdown)}`;
  }

  // Helper methods for document handling (updated to match new model structure)
  getDocumentsCount(verification: AdminHostVerificationResponseDto): number {
    let count = 0;
    if (verification.documentUrl1) count++;
    if (verification.documentUrl2) count++;
    return count;
  }

  hasDocuments(verification: AdminHostVerificationResponseDto): boolean {
    return !!(verification.documentUrl1 || verification.documentUrl2);
  }

  getDocumentUrls(verification: AdminHostVerificationResponseDto): string[] {
    const urls: string[] = [];
    if (verification.documentUrl1Full) urls.push(verification.documentUrl1Full);
    if (verification.documentUrl2Full) urls.push(verification.documentUrl2Full);
    return urls;
  }
  /**
 * Handle image loading errors by hiding the image element
 * @param event - The error event from the image element
 */
onImageError(event: Event): void {
  const target = event.target as HTMLImageElement;
  if (target) {
    target.style.display = 'none';
  }
}

// Alternative method with more robust error handling:
onImageErrorWithFallback(event: Event): void {
  const target = event.target as HTMLImageElement;
  if (target) {
    // Option 1: Hide the image
    target.style.display = 'none';
    
    // Option 2: Show a placeholder image instead
    // target.src = 'assets/images/placeholder-document.png';
    
    // Option 3: Add an error class for styling
    // target.classList.add('image-error');
  }
}
}