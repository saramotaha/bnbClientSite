import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {
  HostVerification,
  HostVerificationResponse,
  VerificationFilters,
  AdminHostVerificationResponseDto
} from '../Models/admin-host-verification.model';

// DTO interface matching your controller's AdminNotesDto
export interface AdminNotesDto {
  adminNotes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class HostVerificationService {
  private readonly baseUrl = 'http://localhost:7145/api/HostVerification';
  private verificationsSubject = new BehaviorSubject<HostVerification[]>([]);
  public verifications$ = this.verificationsSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Get all host verifications with document URLs - matches [HttpGet("with-documents")]
  getAllVerificationsWithDocuments(): Observable<AdminHostVerificationResponseDto[]> {
    return this.http.get<AdminHostVerificationResponseDto[]>(`${this.baseUrl}/with-documents`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Get all host verifications - matches [HttpGet] GetAllVerifications()
  getAllVerifications(): Observable<HostVerification[]> {
    return this.http.get<HostVerification[]>(`${this.baseUrl}`)
      .pipe(
        map(verifications => {
          this.verificationsSubject.next(verifications);
          return verifications;
        }),
        catchError(this.handleError)
      );
  }

  // Get verification by ID with documents - matches [HttpGet("{id}/with-documents")]
  getVerificationByIdWithDocuments(id: number): Observable<AdminHostVerificationResponseDto> {
    return this.http.get<AdminHostVerificationResponseDto>(`${this.baseUrl}/${id}/with-documents`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Get verification by ID - matches [HttpGet("{id}")] GetVerificationById(int id)
  getVerificationById(id: number): Observable<HostVerification> {
    return this.http.get<HostVerification>(`${this.baseUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Get verifications by status with documents - matches [HttpGet("status/{status}/with-documents")]
  getVerificationsByStatusWithDocuments(status: string): Observable<AdminHostVerificationResponseDto[]> {
    return this.http.get<AdminHostVerificationResponseDto[]>(`${this.baseUrl}/status/${status}/with-documents`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Get verifications by status - matches [HttpGet("status/{status}")] GetVerificationsByStatus(string status)
  getVerificationsByStatus(status: string): Observable<HostVerification[]> {
    return this.http.get<HostVerification[]>(`${this.baseUrl}/status/${status}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Get verifications by host ID with documents - matches [HttpGet("host/{hostId}/with-documents")]
  getVerificationsByHostIdWithDocuments(hostId: number): Observable<AdminHostVerificationResponseDto[]> {
    return this.http.get<AdminHostVerificationResponseDto[]>(`${this.baseUrl}/host/${hostId}/with-documents`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Get verifications by host ID - matches [HttpGet("host/{hostId}")] GetVerificationsByHostId(int hostId)
  getVerificationsByHostId(hostId: number): Observable<HostVerification[]> {
    return this.http.get<HostVerification[]>(`${this.baseUrl}/host/${hostId}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Get document file as blob - matches [HttpGet("{id}/document/{documentNumber}")]
  getDocumentFile(verificationId: number, documentNumber: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${verificationId}/document/${documentNumber}`, {
      responseType: 'blob'
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Get document file URL for direct viewing
  getDocumentFileUrl(verificationId: number, documentNumber: number): string {
    return `${this.baseUrl}/${verificationId}/document/${documentNumber}`;
  }

  // Create object URL for viewing documents
  createDocumentObjectUrl(verificationId: number, documentNumber: number): Observable<string> {
    return this.getDocumentFile(verificationId, documentNumber).pipe(
      map(blob => URL.createObjectURL(blob)),
      catchError(this.handleError)
    );
  }

  // Download document file
  downloadDocument(verificationId: number, documentNumber: number, fileName?: string): Observable<void> {
    return this.getDocumentFile(verificationId, documentNumber).pipe(
      map(blob => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName || `document_${verificationId}_${documentNumber}`;
        link.click();
        URL.revokeObjectURL(url);
      }),
      catchError(this.handleError)
    );
  }

  // View document in new tab
  viewDocumentInNewTab(verificationId: number, documentNumber: number): void {
    const url = this.getDocumentFileUrl(verificationId, documentNumber);
    window.open(url, '_blank');
  }

  // Add host verification - matches [HttpPost("AddVerifications")]
  addVerification(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/AddVerifications`, formData)
      .pipe(
        map(response => {
          this.refreshVerifications();
          return response;
        }),
        catchError(this.handleError)
      );
  }

  // Approve host verification - matches [HttpPut("{id}/approve")] ApproveVerification(int id, [FromBody] AdminNotesDto? adminNotesDto = null)
  approveVerification(id: number, adminNotes?: string): Observable<HostVerificationResponse> {
    const body: AdminNotesDto = { adminNotes };

    return this.http.put<HostVerificationResponse>(`${this.baseUrl}/${id}/approve`, body)
      .pipe(
        map(response => {
          this.refreshVerifications();
          return response;
        }),
        catchError(this.handleError)
      );
  }

  // Reject host verification - matches [HttpPut("{id}/reject")] RejectVerification(int id, [FromBody] AdminNotesDto? adminNotesDto = null)
  rejectVerification(id: number, adminNotes?: string): Observable<HostVerificationResponse> {
    const body: AdminNotesDto = { adminNotes };

    return this.http.put<HostVerificationResponse>(`${this.baseUrl}/${id}/reject`, body)
      .pipe(
        map(response => {
          this.refreshVerifications();
          return response;
        }),
        catchError(this.handleError)
      );
  }

  // Filter verifications - uses existing endpoints to filter client-side or by status
  filterVerifications(filters: VerificationFilters): Observable<HostVerification[]> {
    // If only status filter is provided, use the status endpoint
    if (filters.status && !filters.hostId && !filters.verificationType && !filters.dateFrom && !filters.dateTo) {
      return this.getVerificationsByStatus(filters.status);
    }

    // If only hostId filter is provided, use the host endpoint
    if (filters.hostId && !filters.status && !filters.verificationType && !filters.dateFrom && !filters.dateTo) {
      return this.getVerificationsByHostId(filters.hostId);
    }

    // For complex filtering, get all and filter client-side
    return this.getAllVerifications().pipe(
      map(verifications => this.filterVerificationsClientSide(verifications, filters))
    );
  }

  // Client-side filtering for verifications with documents
  private filterVerificationsWithDocumentsClientSide(
    verifications: AdminHostVerificationResponseDto[],
    filters: VerificationFilters
  ): AdminHostVerificationResponseDto[] {
    return verifications.filter(verification => {
      let matches = true;

      if (filters.status && verification.status.toLowerCase() !== filters.status.toLowerCase()) {
        matches = false;
      }

      if (filters.hostId && verification.hostId !== filters.hostId) {
        matches = false;
      }

      if (filters.dateFrom) {
        const submittedDate = new Date(verification.submittedAt);
        if (submittedDate < filters.dateFrom) {
          matches = false;
        }
      }

      if (filters.dateTo) {
        const submittedDate = new Date(verification.submittedAt);
        if (submittedDate > filters.dateTo) {
          matches = false;
        }
      }

      if (filters.verificationType && verification.type !== filters.verificationType) {
        matches = false;
      }

      return matches;
    });
  }

  // Client-side filtering for complex filters
  private filterVerificationsClientSide(verifications: HostVerification[], filters: VerificationFilters): HostVerification[] {
    return verifications.filter(verification => {
      let matches = true;

      if (filters.status && verification.status.toLowerCase() !== filters.status.toLowerCase()) {
        matches = false;
      }

      if (filters.hostId && verification.hostId !== filters.hostId) {
        matches = false;
      }

      if (filters.dateFrom) {
        const submittedDate = new Date(verification.submittedDate);
        if (submittedDate < filters.dateFrom) {
          matches = false;
        }
      }

      if (filters.dateTo) {
        const submittedDate = new Date(verification.submittedDate);
        if (submittedDate > filters.dateTo) {
          matches = false;
        }
      }

      if (filters.verificationType && verification.VerificationType !== filters.verificationType) {
        matches = false;
      }

      return matches;
    });
  }

  // Check if file is an image
  isImageFile(fileName: string): boolean {
    if (!fileName) return false;
    const extension = fileName.toLowerCase().split('.').pop();
    return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension || '');
  }

  // Check if file is a PDF
  isPdfFile(fileName: string): boolean {
    if (!fileName) return false;
    const extension = fileName.toLowerCase().split('.').pop();
    return extension === 'pdf';
  }

  // Get file icon based on extension
  getFileIcon(fileName: string): string {
    if (!fileName) return 'fas fa-file';

    const extension = fileName.toLowerCase().split('.').pop();

    switch (extension) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'bmp':
      case 'webp':
        return 'fas fa-file-image';
      case 'pdf':
        return 'fas fa-file-pdf';
      case 'doc':
      case 'docx':
        return 'fas fa-file-word';
      default:
        return 'fas fa-file';
    }
  }

  // Refresh verifications list
  private refreshVerifications(): void {
    this.getAllVerifications().subscribe();
  }

  // Error handler
  private handleError = (error: any): Observable<never> => {
    console.error('Host Verification Service Error:', error);

    // Handle specific error cases
    if (error.status === 404) {
      console.error('Resource not found');
    } else if (error.status === 400) {
      console.error('Bad request:', error.error?.error || error.message);
    } else if (error.status === 500) {
      console.error('Internal server error:', error.error?.message || error.message);
    }

    return throwError(() => error);
  };

  // Get verification status color for UI
  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'danger';
      case 'pending':
        return 'warning';
      case 'under_review':
        return 'info';
      default:
        return 'secondary';
    }
  }

  // Get verification status icon for UI
  getStatusIcon(status: string): string {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'fas fa-check-circle';
      case 'rejected':
        return 'fas fa-times-circle';
      case 'pending':
        return 'fas fa-clock';
      case 'under_review':
        return 'fas fa-eye';
      default:
        return 'fas fa-question-circle';
    }
  }

  // Helper method to create FormData for file uploads
  createVerificationFormData(data: any, files?: File[]): FormData {
    const formData = new FormData();

    // Add form fields
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });

    // Add files if provided
    if (files && files.length > 0) {
      files.forEach((file, index) => {
        formData.append(`files`, file);
      });
    }

    return formData;
  }
}
