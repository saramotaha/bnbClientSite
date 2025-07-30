// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
// import { Subject, takeUntil, debounceTime, distinctUntilChanged, interval, switchMap, merge, EMPTY, timer, of } from 'rxjs';
// import { 
//   AdminHostVerificationListDto, 
//   AdminHostVerificationResponseDto,
//   HostVerificationStatusUpdateDto,
//   VerificationFilters,
//   VerificationStatus 
// } from '../../Models/admin-host-verification.model';
// import { HostVerificationService } from '../../Services/admin-host-verification.service';

// @Component({
//   selector: 'app-host-verification',
//   standalone: true,
//   imports: [CommonModule, FormsModule, ReactiveFormsModule],
//   templateUrl: './admin-host-verifications.html',
//   styleUrls: ['./admin-host-verifications.css']
// })
// export class AdminHostVerificationComponent implements OnInit, OnDestroy {
//   private destroy$ = new Subject<void>();
//   private refreshTrigger$ = new Subject<void>();
//   public autoRefreshInterval = 30000; // Default to 30 seconds
//   public isPageVisible = true;
  
//   // Data properties
//   verifications: AdminHostVerificationListDto[] = [];
//   filteredVerifications: AdminHostVerificationListDto[] = [];
//   selectedVerification: AdminHostVerificationResponseDto | null = null;
  
//   // UI state
//   isLoading = false;
//   isLoadingDetail = false;
//   showFilters = false;
//   showDetailModal = false;
//   showApprovalModal = false;
//   showRejectionModal = false;
  
//   // Auto-refresh state
//   autoRefreshEnabled = true;
//   lastRefreshTime = new Date();
//   nextRefreshCountdown = this.autoRefreshInterval / 1000;
  
//   // Pagination
//   currentPage = 1;
//   itemsPerPage = 10;
//   totalItems = 0;
  
//   // Forms
//   filterForm!: FormGroup;
//   approvalForm!: FormGroup;
//   rejectionForm!: FormGroup;
  
//   // Filter options
//   statusOptions = [
//     { value: '', label: 'All Statuses' },
//     { value: 'pending', label: 'Pending' },
//     { value: 'approved', label: 'Approved' },
//     { value: 'rejected', label: 'Rejected' },
//     // { value: 'under_review', label: 'Under Review' }
//   ];
  
//   verificationTypeOptions = [
//     { value: '', label: 'All Types' },

//   ];

//   constructor(
//     private hostVerificationService: HostVerificationService,
//     private fb: FormBuilder
//   ) {
//     this.initializeForms();
//     this.setupPageVisibilityListener();
//   }

//   ngOnInit(): void {
//     this.setupAutoRefresh();
//     this.setupFilterSubscription();
//     this.startCountdownTimer();
//   }

//   ngOnDestroy(): void {
//     this.destroy$.next();
//     this.destroy$.complete();
//   }

//   private initializeForms(): void {
//     this.filterForm = this.fb.group({
//       status: [''],
//       hostId: [''],
//       verificationType: [''],
//       dateFrom: [''],
//       dateTo: [''],
//       searchTerm: ['']
//     });

//     this.approvalForm = this.fb.group({
//       comments: [''],
//       reviewedBy: ['Admin']
//     });

//     this.rejectionForm = this.fb.group({
//       comments: [''],
//       reviewedBy: ['Admin']
//     });
//   }

//   private setupPageVisibilityListener(): void {
//     document.addEventListener('visibilitychange', () => {
//       this.isPageVisible = !document.hidden;
//       if (this.isPageVisible && this.autoRefreshEnabled) {
//         // Refresh immediately when page becomes visible
//         this.refreshTrigger$.next();
//       }
//     });
//   }

//   private setupAutoRefresh(): void {
//     // Create auto-refresh stream that triggers every X seconds
//     const autoRefresh$ = interval(this.autoRefreshInterval).pipe(
//       takeUntil(this.destroy$)
//     );

//     // Create manual refresh stream
//     const manualRefresh$ = this.refreshTrigger$.pipe(
//       takeUntil(this.destroy$)
//     );

//     // Combine both streams and add initial load
//     const refreshStream$ = merge(
//       of(0), // Emit initial value for the first load
//       autoRefresh$,
//       manualRefresh$
//     ).pipe(
//       // Only refresh if page is visible and auto-refresh is enabled, or if manual trigger
//       switchMap(() => {
//         if (!this.isPageVisible && !this.autoRefreshEnabled) {
//           return EMPTY;
//         }
//         return this.hostVerificationService.getAllHostVerifications();
//       }),
//       takeUntil(this.destroy$)
//     );

//     // Subscribe to the refresh stream
//     refreshStream$.subscribe({
//       next: (verifications) => {
//         const previousCount = this.verifications.length;
//         this.verifications = verifications;
//         this.applyFilters();
//         this.lastRefreshTime = new Date();
        
//         // Check for new verifications and optionally show notification
//         if (verifications.length > previousCount) {
//           this.onNewVerificationsDetected(verifications.length - previousCount);
//         }
        
//         // Reset countdown
//         this.nextRefreshCountdown = this.autoRefreshInterval / 1000;
//       },
//       error: (error) => {
//         console.error('Error during auto-refresh:', error);
//         // Continue auto-refresh even on error
//       }
//     });
//   }

//   private startCountdownTimer(): void {
//     timer(0, 1000).pipe(
//       takeUntil(this.destroy$)
//     ).subscribe(() => {
//       if (this.autoRefreshEnabled && this.nextRefreshCountdown > 0) {
//         this.nextRefreshCountdown--;
//       }
//       if (this.nextRefreshCountdown <= 0) {
//         this.nextRefreshCountdown = this.autoRefreshInterval / 1000;
//       }
//     });
//   }

//   private onNewVerificationsDetected(count: number): void {
//     // Optional: Show toast notification or update UI indicator
//     console.log(`${count} new verification(s) detected`);
    
//     // You can add toast notification here
//     // this.toastService.show(`${count} new verification(s) received`, 'info');
//   }

//   private setupFilterSubscription(): void {
//     this.filterForm.valueChanges
//       .pipe(
//         takeUntil(this.destroy$),
//         debounceTime(300),
//         distinctUntilChanged()
//       )
//       .subscribe(() => {
//         this.applyFilters();
//         // Trigger immediate refresh when filters change
//         this.refreshTrigger$.next();
//       });
//   }

//   loadVerifications(): void {
//     // Manual refresh trigger
//     this.refreshTrigger$.next();
//   }

//   applyFilters(): void {
//     const filters = this.filterForm.value;
//     let filtered = [...this.verifications];

//     // Apply status filter
//     if (filters.status) {
//       filtered = filtered.filter(v => v.status.toLowerCase() === filters.status.toLowerCase());
//     }

//     // Apply host ID filter
//     if (filters.hostId) {
//       filtered = filtered.filter(v => v.hostId.toString().includes(filters.hostId));
//     }

//     // Apply verification type filter
//     if (filters.verificationType) {
//       filtered = filtered.filter(v => v.verificationType?.toLowerCase() === filters.verificationType.toLowerCase());
//     }

//     // Apply date range filter
//     if (filters.dateFrom) {
//       const fromDate = new Date(filters.dateFrom);
//       filtered = filtered.filter(v => new Date(v.submittedDate) >= fromDate);
//     }

//     if (filters.dateTo) {
//       const toDate = new Date(filters.dateTo);
//       filtered = filtered.filter(v => new Date(v.submittedDate) <= toDate);
//     }

//     // Apply search term filter
//     if (filters.searchTerm) {
//       const term = filters.searchTerm.toLowerCase();
//       filtered = filtered.filter(v => 
//         v.hostName.toLowerCase().includes(term) ||
//         v.hostEmail.toLowerCase().includes(term) ||
//         v.id.toString().includes(term)
//       );
//     }

//     this.filteredVerifications = filtered;
//     this.totalItems = filtered.length;
    
//     // Only reset to first page if we're not just refreshing data
//     if (this.currentPage > this.totalPages && this.totalPages > 0) {
//       this.currentPage = this.totalPages;
//     }
//   }

//   viewDetails(verification: AdminHostVerificationListDto): void {
//     this.isLoadingDetail = true;
//     this.showDetailModal = true;
    
//     if (verification.id) {
//       this.hostVerificationService.getAdminVerificationById(verification.id)
//         .pipe(takeUntil(this.destroy$))
//         .subscribe({
//           next: (detail) => {
//             this.selectedVerification = detail;
//             this.isLoadingDetail = false;
//           },
//           error: (error) => {
//             console.error('Error loading verification details:', error);
//             this.isLoadingDetail = false;
//             this.showDetailModal = false;
//           }
//         });
//     } else {
//       console.error('Selected verification is null or missing an ID.');
//       this.isLoadingDetail = false;
//       this.showDetailModal = false;
//     }
//   }

//   openApprovalModal(verification: AdminHostVerificationListDto): void {
//     this.selectedVerification = verification as any;
//     this.showApprovalModal = true;
//     this.approvalForm.reset({ reviewedBy: 'Admin' });
//   }

//   openRejectionModal(verification: AdminHostVerificationListDto): void {
//     this.selectedVerification = verification as any;
//     this.showRejectionModal = true;
//     this.rejectionForm.reset({ reviewedBy: 'Admin' });
//   }

//   approveVerification(): void {
//     if (!this.selectedVerification || this.approvalForm.invalid) return;

//     const request: HostVerificationStatusUpdateDto = {
//       status: 'approved',
//       comments: this.approvalForm.value.comments,
//       reviewedBy: this.approvalForm.value.reviewedBy
//     };

//     this.hostVerificationService.approveVerification(this.selectedVerification.id, request)
//       .pipe(takeUntil(this.destroy$))
//       .subscribe({
//         next: () => {
//           this.showApprovalModal = false;
//           this.selectedVerification = null;
//           // Trigger immediate refresh after approval
//           this.refreshTrigger$.next();
//         },
//         error: (error) => {
//           console.error('Error approving verification:', error);
//         }
//       });
//   }

//   rejectVerification(): void {
//     if (!this.selectedVerification || this.rejectionForm.invalid) return;

//     const request: HostVerificationStatusUpdateDto = {
//       status: 'rejected',
//       comments: this.rejectionForm.value.comments,
//       reviewedBy: this.rejectionForm.value.reviewedBy
//     };

//     this.hostVerificationService.rejectVerification(this.selectedVerification.id, request)
//       .pipe(takeUntil(this.destroy$))
//       .subscribe({
//         next: () => {
//           this.showRejectionModal = false;
//           this.selectedVerification = null;
//           // Trigger immediate refresh after rejection
//           this.refreshTrigger$.next();
//         },
//         error: (error) => {
//           console.error('Error rejecting verification:', error);
//         }
//       });
//   }

//   closeModals(): void {
//     this.showDetailModal = false;
//     this.showApprovalModal = false;
//     this.showRejectionModal = false;
//     this.selectedVerification = null;
//   }

//   toggleFilters(): void {
//     this.showFilters = !this.showFilters;
//   }

//   clearFilters(): void {
//     this.filterForm.reset();
//     // Filters subscription will trigger refresh automatically
//   }

//   // Auto-refresh control methods
//   toggleAutoRefresh(): void {
//     this.autoRefreshEnabled = !this.autoRefreshEnabled;
//     if (this.autoRefreshEnabled) {
//       this.nextRefreshCountdown = this.autoRefreshInterval / 1000;
//       this.refreshTrigger$.next();
//     }
//   }

//   setRefreshInterval(seconds: number): void {
//     this.autoRefreshInterval = seconds * 1000;
//     this.nextRefreshCountdown = seconds;
//   }

//   forceRefresh(): void {
//     this.refreshTrigger$.next();
//   }

//   exportToCSV(): void {
//     const csvData = this.filteredVerifications.map(v => ({
//       ID: v.id,
//       'Host Name': v.hostName,
//       'Host Email': v.hostEmail,
//       Status: v.status,
//       'Submitted Date': new Date(v.submittedDate).toLocaleDateString(),
//       'Verification Type': v.verificationType,
//       'Documents Count': v.documentsCount
//     }));

//     this.downloadCSV(csvData, 'host-verifications.csv');
//   }

//   private downloadCSV(data: any[], filename: string): void {
//     const csvContent = this.convertToCSV(data);
//     const blob = new Blob([csvContent], { type: 'text/csv' });
//     const url = window.URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = filename;
//     link.click();
//     window.URL.revokeObjectURL(url);
//   }

//   private convertToCSV(data: any[]): string {
//     if (!data.length) return '';
    
//     const headers = Object.keys(data[0]);
//     const csvRows = [
//       headers.join(','),
//       ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
//     ];
    
//     return csvRows.join('\n');
//   }

//   // Pagination methods
//   get paginatedVerifications(): AdminHostVerificationListDto[] {
//     const startIndex = (this.currentPage - 1) * this.itemsPerPage;
//     const endIndex = startIndex + this.itemsPerPage;
//     return this.filteredVerifications.slice(startIndex, endIndex);
//   }

//   get totalPages(): number {
//     return Math.ceil(this.totalItems / this.itemsPerPage);
//   }

//   get pageNumbers(): number[] {
//     const pages = [];
//     const totalPages = this.totalPages;
//     const currentPage = this.currentPage;
    
//     let startPage = Math.max(1, currentPage - 2);
//     let endPage = Math.min(totalPages, startPage + 4);
    
//     if (endPage - startPage < 4) {
//       startPage = Math.max(1, endPage - 4);
//     }
    
//     for (let i = startPage; i <= endPage; i++) {
//       pages.push(i);
//     }
    
//     return pages;
//   }

//   changePage(page: number): void {
//     if (page >= 1 && page <= this.totalPages) {
//       this.currentPage = page;
//     }
//   }

//   changeItemsPerPage(itemsPerPage: number): void {
//     this.itemsPerPage = itemsPerPage;
//     this.currentPage = 1;
//   }

//   // Utility methods
//   getStatusColor(status: string): string {
//     return this.hostVerificationService.getStatusColor(status);
//   }

//   getStatusIcon(status: string): string {
//     return this.hostVerificationService.getStatusIcon(status);
//   }

//   formatDate(date: Date | string): string {
//     return new Date(date).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   }

//   formatCountdown(seconds: number): string {
//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = seconds % 60;
//     return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
//   }

//   downloadDocument(fileUrl: string, fileName: string): void {
//     window.open(fileUrl, '_blank');
//   }

//   // TrackBy function for performance optimization
//   trackByVerificationId(index: number, verification: AdminHostVerificationListDto): any {
//     return verification.id;
//   }

//   // Getter for auto-refresh status display
//   get refreshStatusText(): string {
//     if (!this.autoRefreshEnabled) {
//       return 'Auto-refresh disabled';
//     }
//     if (!this.isPageVisible) {
//       return 'Paused (page not visible)';
//     }
//     return `Next refresh in ${this.formatCountdown(this.nextRefreshCountdown)}`;
//   }
// }
// ////////======================================================================================//////
// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
// import { Subject, takeUntil, debounceTime, distinctUntilChanged, interval, switchMap, merge, EMPTY, timer, of } from 'rxjs';
// import { 
//   HostVerification,
//   VerificationFilters,
//   VerificationStatus 
// } from '../../Models/admin-host-verification.model';
// import { HostVerificationService } from '../../Services/admin-host-verification.service';

// @Component({
//   selector: 'app-host-verification',
//   standalone: true,
//   imports: [CommonModule, FormsModule, ReactiveFormsModule],
//   templateUrl: './admin-host-verifications.html',
//   styleUrls: ['./admin-host-verifications.css']
// })
// export class AdminHostVerificationComponent implements OnInit, OnDestroy {
//   private destroy$ = new Subject<void>();
//   private refreshTrigger$ = new Subject<void>();
//   public autoRefreshInterval = 30000; // Default to 30 seconds
//   public isPageVisible = true;
  
//   // Data properties - Updated to use HostVerification interface
//   verifications: HostVerification[] = [];
//   filteredVerifications: HostVerification[] = [];
//   selectedVerification: HostVerification | null = null;
  
//   // UI state
//   isLoading = false;
//   isLoadingDetail = false;
//   showFilters = false;
//   showDetailModal = false;
//   showApprovalModal = false;
//   showRejectionModal = false;
  
//   // Auto-refresh state
//   autoRefreshEnabled = true;
//   lastRefreshTime = new Date();
//   nextRefreshCountdown = this.autoRefreshInterval / 1000;
  
//   // Pagination
//   currentPage = 1;
//   itemsPerPage = 10;
//   totalItems = 0;
  
//   // Forms
//   filterForm!: FormGroup;
//   approvalForm!: FormGroup;
//   rejectionForm!: FormGroup;
  
//   // Filter options
//   statusOptions = [
//     { value: '', label: 'All Statuses' },
//     { value: 'pending', label: 'Pending' },
//     { value: 'approved', label: 'Approved' },
//     { value: 'rejected', label: 'Rejected' },
//     // { value: 'under_review', label: 'Under Review' }
//   ];
  
//   verificationTypeOptions = [
//     { value: '', label: 'All Types' },
//     // Add your verification types here if needed
//   ];

//   constructor(
//     private hostVerificationService: HostVerificationService,
//     private fb: FormBuilder
//   ) {
//     this.initializeForms();
//     this.setupPageVisibilityListener();
//   }

//   ngOnInit(): void {
//     this.setupAutoRefresh();
//     this.setupFilterSubscription();
//     this.startCountdownTimer();
//   }

//   ngOnDestroy(): void {
//     this.destroy$.next();
//     this.destroy$.complete();
//   }

//   private initializeForms(): void {
//     this.filterForm = this.fb.group({
//       status: [''],
//       hostId: [''],
//       verificationType: [''],
//       dateFrom: [''],
//       dateTo: [''],
//       searchTerm: ['']
//     });

//     this.approvalForm = this.fb.group({
//       adminNotes: [''] // Updated to match AdminNotesDto
//     });

//     this.rejectionForm = this.fb.group({
//       adminNotes: [''] // Updated to match AdminNotesDto
//     });
//   }

//   private setupPageVisibilityListener(): void {
//     document.addEventListener('visibilitychange', () => {
//       this.isPageVisible = !document.hidden;
//       if (this.isPageVisible && this.autoRefreshEnabled) {
//         // Refresh immediately when page becomes visible
//         this.refreshTrigger$.next();
//       }
//     });
//   }

//   private setupAutoRefresh(): void {
//     // Create auto-refresh stream that triggers every X seconds
//     const autoRefresh$ = interval(this.autoRefreshInterval).pipe(
//       takeUntil(this.destroy$)
//     );

//     // Create manual refresh stream
//     const manualRefresh$ = this.refreshTrigger$.pipe(
//       takeUntil(this.destroy$)
//     );

//     // Combine both streams and add initial load
//     const refreshStream$ = merge(
//       of(0), // Emit initial value for the first load
//       autoRefresh$,
//       manualRefresh$
//     ).pipe(
//       // Only refresh if page is visible and auto-refresh is enabled, or if manual trigger
//       switchMap(() => {
//         if (!this.isPageVisible && !this.autoRefreshEnabled) {
//           return EMPTY;
//         }
//         // Updated to use the new service method
//         return this.hostVerificationService.getAllVerifications();
//       }),
//       takeUntil(this.destroy$)
//     );

//     // Subscribe to the refresh stream
//     refreshStream$.subscribe({
//       next: (verifications) => {
//         const previousCount = this.verifications.length;
//         this.verifications = verifications;
//         this.applyFilters();
//         this.lastRefreshTime = new Date();
        
//         // Check for new verifications and optionally show notification
//         if (verifications.length > previousCount) {
//           this.onNewVerificationsDetected(verifications.length - previousCount);
//         }
        
//         // Reset countdown
//         this.nextRefreshCountdown = this.autoRefreshInterval / 1000;
//       },
//       error: (error) => {
//         console.error('Error during auto-refresh:', error);
//         // Continue auto-refresh even on error
//       }
//     });
//   }

//   private startCountdownTimer(): void {
//     timer(0, 1000).pipe(
//       takeUntil(this.destroy$)
//     ).subscribe(() => {
//       if (this.autoRefreshEnabled && this.nextRefreshCountdown > 0) {
//         this.nextRefreshCountdown--;
//       }
//       if (this.nextRefreshCountdown <= 0) {
//         this.nextRefreshCountdown = this.autoRefreshInterval / 1000;
//       }
//     });
//   }

//   private onNewVerificationsDetected(count: number): void {
//     // Optional: Show toast notification or update UI indicator
//     console.log(`${count} new verification(s) detected`);
    
//     // You can add toast notification here
//     // this.toastService.show(`${count} new verification(s) received`, 'info');
//   }

//   private setupFilterSubscription(): void {
//     this.filterForm.valueChanges
//       .pipe(
//         takeUntil(this.destroy$),
//         debounceTime(300),
//         distinctUntilChanged()
//       )
//       .subscribe(() => {
//         this.applyFilters();
//         // Don't trigger immediate refresh for filter changes, use client-side filtering
//       });
//   }

//   loadVerifications(): void {
//     // Manual refresh trigger
//     this.refreshTrigger$.next();
//   }

//   applyFilters(): void {
//     const filters = this.filterForm.value;
    
//     // Create VerificationFilters object
//     const verificationFilters: VerificationFilters = {
//       status: filters.status || undefined,
//       hostId: filters.hostId ? parseInt(filters.hostId, 10) : undefined,
//       verificationType: filters.verificationType || undefined,
//       dateFrom: filters.dateFrom ? new Date(filters.dateFrom) : undefined,
//       dateTo: filters.dateTo ? new Date(filters.dateTo) : undefined
//     };

//     // Use the service's filter method if there are API-supported filters
//     if (verificationFilters.status || verificationFilters.hostId) {
//       this.hostVerificationService.filterVerifications(verificationFilters)
//         .pipe(takeUntil(this.destroy$))
//         .subscribe({
//           next: (filtered) => {
//             this.filteredVerifications = this.applyAdditionalFilters(filtered, filters);
//             this.totalItems = this.filteredVerifications.length;
//             this.adjustCurrentPage();
//           },
//           error: (error) => {
//             console.error('Error filtering verifications:', error);
//           }
//         });
//     } else {
//       // Apply client-side filtering for complex cases
//       this.filteredVerifications = this.applyClientSideFilters(this.verifications, filters);
//       this.totalItems = this.filteredVerifications.length;
//       this.adjustCurrentPage();
//     }
//   }

//   private applyClientSideFilters(verifications: HostVerification[], filters: any): HostVerification[] {
//     let filtered = [...verifications];

//     // Apply additional filters that might not be supported by API
//     if (filters.searchTerm) {
//       const term = filters.searchTerm.toLowerCase();
//       filtered = filtered.filter(v => 
//         (v.hostName && v.hostName.toLowerCase().includes(term)) ||
//         (v.hostEmail && v.hostEmail.toLowerCase().includes(term)) ||
//         v.id.toString().includes(term)
//       );
//     }

//     return filtered;
//   }

//   private applyAdditionalFilters(verifications: HostVerification[], filters: any): HostVerification[] {
//     return this.applyClientSideFilters(verifications, filters);
//   }

//   private adjustCurrentPage(): void {
//     // Only reset to first page if we're not just refreshing data
//     if (this.currentPage > this.totalPages && this.totalPages > 0) {
//       this.currentPage = this.totalPages;
//     }
//   }

//   viewDetails(verification: HostVerification): void {
//     this.isLoadingDetail = true;
//     this.showDetailModal = true;
    
//     // Use the existing verification data or fetch detailed info
//     this.hostVerificationService.getVerificationById(verification.id)
//       .pipe(takeUntil(this.destroy$))
//       .subscribe({
//         next: (detail) => {
//           this.selectedVerification = detail;
//           this.isLoadingDetail = false;
//         },
//         error: (error) => {
//           console.error('Error loading verification details:', error);
//           this.isLoadingDetail = false;
//           this.showDetailModal = false;
//         }
//       });
//   }

//   openApprovalModal(verification: HostVerification): void {
//     this.selectedVerification = verification;
//     this.showApprovalModal = true;
//     this.approvalForm.reset();
//   }

//   openRejectionModal(verification: HostVerification): void {
//     this.selectedVerification = verification;
//     this.showRejectionModal = true;
//     this.rejectionForm.reset();
//   }

//   approveVerification(): void {
//     if (!this.selectedVerification || this.approvalForm.invalid) return;

//     const adminNotes = this.approvalForm.value.adminNotes;

//     this.hostVerificationService.approveVerification(this.selectedVerification.id, adminNotes)
//       .pipe(takeUntil(this.destroy$))
//       .subscribe({
//         next: (response) => {
//           console.log('Approval successful:', response);
//           this.showApprovalModal = false;
//           this.selectedVerification = null;
//           // Trigger immediate refresh after approval
//           this.refreshTrigger$.next();
//         },
//         error: (error) => {
//           console.error('Error approving verification:', error);
//         }
//       });
//   }

//   rejectVerification(): void {
//     if (!this.selectedVerification || this.rejectionForm.invalid) return;

//     const adminNotes = this.rejectionForm.value.adminNotes;

//     this.hostVerificationService.rejectVerification(this.selectedVerification.id, adminNotes)
//       .pipe(takeUntil(this.destroy$))
//       .subscribe({
//         next: (response) => {
//           console.log('Rejection successful:', response);
//           this.showRejectionModal = false;
//           this.selectedVerification = null;
//           // Trigger immediate refresh after rejection
//           this.refreshTrigger$.next();
//         },
//         error: (error) => {
//           console.error('Error rejecting verification:', error);
//         }
//       });
//   }

//   closeModals(): void {
//     this.showDetailModal = false;
//     this.showApprovalModal = false;
//     this.showRejectionModal = false;
//     this.selectedVerification = null;
//   }

//   toggleFilters(): void {
//     this.showFilters = !this.showFilters;
//   }

//   clearFilters(): void {
//     this.filterForm.reset();
//     // Apply filters will be triggered automatically by form subscription
//   }

//   // Auto-refresh control methods
//   toggleAutoRefresh(): void {
//     this.autoRefreshEnabled = !this.autoRefreshEnabled;
//     if (this.autoRefreshEnabled) {
//       this.nextRefreshCountdown = this.autoRefreshInterval / 1000;
//       this.refreshTrigger$.next();
//     }
//   }

//   setRefreshInterval(seconds: number): void {
//     this.autoRefreshInterval = seconds * 1000;
//     this.nextRefreshCountdown = seconds;
//   }

//   forceRefresh(): void {
//     this.refreshTrigger$.next();
//   }

//   exportToCSV(): void {
//     const csvData = this.filteredVerifications.map(v => ({
//       ID: v.id,
//       'Host ID': v.hostId,
//       'Host Name': v.hostName || 'N/A',
//       'Host Email': v.hostEmail || 'N/A',
//       Status: v.status,
//       'Submitted Date': new Date(v.submittedDate).toLocaleDateString(),
//       'Reviewed Date': v.reviewedDate ? new Date(v.reviewedDate).toLocaleDateString() : 'N/A',
//       'Reviewed By': v.reviewedBy || 'N/A',
//       'Documents Count': v.documents ? v.documents.length : 0,
//       Comments: v.comments || ''
//     }));

//     this.downloadCSV(csvData, 'host-verifications.csv');
//   }

//   private downloadCSV(data: any[], filename: string): void {
//     const csvContent = this.convertToCSV(data);
//     const blob = new Blob([csvContent], { type: 'text/csv' });
//     const url = window.URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = filename;
//     link.click();
//     window.URL.revokeObjectURL(url);
//   }

//   private convertToCSV(data: any[]): string {
//     if (!data.length) return '';
    
//     const headers = Object.keys(data[0]);
//     const csvRows = [
//       headers.join(','),
//       ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
//     ];
    
//     return csvRows.join('\n');
//   }

//   // Pagination methods
//   get paginatedVerifications(): HostVerification[] {
//     const startIndex = (this.currentPage - 1) * this.itemsPerPage;
//     const endIndex = startIndex + this.itemsPerPage;
//     return this.filteredVerifications.slice(startIndex, endIndex);
//   }

//   get totalPages(): number {
//     return Math.ceil(this.totalItems / this.itemsPerPage);
//   }

//   get pageNumbers(): number[] {
//     const pages = [];
//     const totalPages = this.totalPages;
//     const currentPage = this.currentPage;
    
//     let startPage = Math.max(1, currentPage - 2);
//     let endPage = Math.min(totalPages, startPage + 4);
    
//     if (endPage - startPage < 4) {
//       startPage = Math.max(1, endPage - 4);
//     }
    
//     for (let i = startPage; i <= endPage; i++) {
//       pages.push(i);
//     }
    
//     return pages;
//   }

//   changePage(page: number): void {
//     if (page >= 1 && page <= this.totalPages) {
//       this.currentPage = page;
//     }
//   }

//   changeItemsPerPage(itemsPerPage: number): void {
//     this.itemsPerPage = itemsPerPage;
//     this.currentPage = 1;
//   }

//   // Utility methods
//   getStatusColor(status: string): string {
//     return this.hostVerificationService.getStatusColor(status);
//   }

//   getStatusIcon(status: string): string {
//     return this.hostVerificationService.getStatusIcon(status);
//   }

//   formatDate(date: Date | string): string {
//     return new Date(date).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   }

//   formatCountdown(seconds: number): string {
//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = seconds % 60;
//     return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
//   }

//   downloadDocument(fileUrl: string, fileName: string): void {
//     window.open(fileUrl, '_blank');
//   }

//   // TrackBy function for performance optimization
//   trackByVerificationId(index: number, verification: HostVerification): any {
//     return verification.id;
//   }

//   // Getter for auto-refresh status display
//   get refreshStatusText(): string {
//     if (!this.autoRefreshEnabled) {
//       return 'Auto-refresh disabled';
//     }
//     if (!this.isPageVisible) {
//       return 'Paused (page not visible)';
//     }
//     return `Next refresh in ${this.formatCountdown(this.nextRefreshCountdown)}`;
//   }

//   // Helper method to get documents count for display
//   getDocumentsCount(verification: HostVerification): number {
//     return verification.documents ? verification.documents.length : 0;
//   }

//   // Helper method to check if verification has documents
//   hasDocuments(verification: HostVerification): boolean {
//     return verification.documents && verification.documents.length > 0;
//   }

//   // Helper method to get first document for quick preview
//   getFirstDocument(verification: HostVerification) {
//     return verification.documents && verification.documents.length > 0 
//       ? verification.documents[0] 
//       : null;
//   }
// }
////////====================================================================================////
// admin-host-verifications.component.ts

import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil, debounceTime, distinctUntilChanged, interval, switchMap, merge, EMPTY, timer, of, finalize } from 'rxjs';
import { 
  HostVerification,
  VerificationFilters,
  VerificationStatus 
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
  
  // Data properties
  verifications: HostVerification[] = [];
  filteredVerifications: HostVerification[] = [];
  selectedVerification: HostVerification | null = null;
  
  // UI state
  isLoading = false;
  isLoadingDetail = false;
  showFilters = false;
  showDetailModal = false;
  showApprovalModal = false;
  showRejectionModal = false;
  
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

  private initializeForms(): void {
    this.filterForm = this.fb.group({
      status: [''],
      hostId: [''],
      verificationType: [''],
      dateFrom: [''],
      dateTo: [''],
      searchTerm: ['']
    });

    this.approvalForm = this.fb.group({
      adminNotes: ['']
    });

    this.rejectionForm = this.fb.group({
      adminNotes: ['']
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
        return this.hostVerificationService.getAllVerifications();
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

    // Apply verification type filter (using VerificationType from model)
    if (filters.verificationType) {
      filtered = filtered.filter(v => v.VerificationType?.toLowerCase() === filters.verificationType.toLowerCase());
    }

    // Apply date range filters
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filtered = filtered.filter(v => new Date(v.submittedDate) >= fromDate);
    }
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      filtered = filtered.filter(v => new Date(v.submittedDate) <= toDate);
    }

    // Apply search term filter
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(v => 
        (v.hostname && v.hostname.toLowerCase().includes(term)) ||
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

  viewDetails(verification: HostVerification): void {
    this.isLoadingDetail = true;
    this.showDetailModal = true;
    
    this.hostVerificationService.getVerificationById(verification.id)
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

  openApprovalModal(verification: HostVerification): void {
    this.selectedVerification = verification;
    this.showApprovalModal = true;
    this.approvalForm.reset();
  }

  openRejectionModal(verification: HostVerification): void {
    this.selectedVerification = verification;
    this.showRejectionModal = true;
    this.rejectionForm.reset();
  }

  approveVerification(): void {
    if (!this.selectedVerification) return;

    const verificationToUpdate = this.selectedVerification;
    const adminNotes = this.approvalForm.value.adminNotes;
    
    // Find the original verification to enable rollback on error
    const originalVerification = { ...this.verifications.find(v => v.id === verificationToUpdate.id) } as HostVerification;

    // --- OPTIMISTIC UI UPDATE & ANIMATION ---
    const verificationInMasterList = this.verifications.find(v => v.id === verificationToUpdate.id);
    const verificationInFilteredList = this.filteredVerifications.find(v => v.id === verificationToUpdate.id);

    // Helper to update local state and trigger animation
    const updateLocalState = (verification: HostVerification) => {
        verification.status = VerificationStatus.Approved;
        verification.AdminNotes = adminNotes;
        verification.reviewedDate = new Date();
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
          // Update with server response if needed
          if (response.verification && verificationInMasterList) {
            Object.assign(verificationInMasterList, response.verification);
          }
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
    const adminNotes = this.rejectionForm.value.adminNotes;
    const originalVerification = { ...this.verifications.find(v => v.id === verificationToUpdate.id) } as HostVerification;
    
    const verificationInMasterList = this.verifications.find(v => v.id === verificationToUpdate.id);
    const verificationInFilteredList = this.filteredVerifications.find(v => v.id === verificationToUpdate.id);

    const updateLocalState = (verification: HostVerification) => {
        verification.status = VerificationStatus.Rejected;
        verification.AdminNotes = adminNotes;
        verification.reviewedDate = new Date();
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
          // Update with server response if needed
          if (response.verification && verificationInMasterList) {
            Object.assign(verificationInMasterList, response.verification);
          }
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
    this.selectedVerification = null;
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
      'Host Name': v.hostname || 'N/A',
      Status: v.status,
      'Verification Type': v.VerificationType || 'N/A',
      'Submitted Date': new Date(v.submittedDate).toLocaleDateString(),
      'Reviewed Date': v.reviewedDate ? new Date(v.reviewedDate).toLocaleDateString() : 'N/A',
      'Admin Notes': v.AdminNotes || '',
      'Document URL 1': v.documentUrl1 || '',
      'Document URL 2': v.documentUrl2 || ''
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

  get paginatedVerifications(): HostVerification[] {
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

  downloadDocument(fileUrl: string, fileName: string): void {
    window.open(fileUrl, '_blank');
  }

  trackByVerificationId(index: number, verification: HostVerification): any {
    return verification.id;
  }

  get refreshStatusText(): string {
    if (!this.autoRefreshEnabled) return 'Auto-refresh disabled';
    if (!this.isPageVisible) return 'Paused (page not visible)';
    return `Next refresh in ${this.formatCountdown(this.nextRefreshCountdown)}`;
  }

  // Helper methods for document handling (updated to match model structure)
  getDocumentsCount(verification: HostVerification): number {
    let count = 0;
    if (verification.documentUrl1) count++;
    if (verification.documentUrl2) count++;
    return count;
  }

  hasDocuments(verification: HostVerification): boolean {
    return !!(verification.documentUrl1 || verification.documentUrl2);
  }

  getDocumentUrls(verification: HostVerification): string[] {
    const urls: string[] = [];
    if (verification.documentUrl1) urls.push(verification.documentUrl1);
    if (verification.documentUrl2) urls.push(verification.documentUrl2);
    return urls;
  }
}