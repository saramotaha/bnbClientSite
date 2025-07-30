// // services/host-verification.service.ts
// import { Injectable } from '@angular/core';
// import { HttpClient, HttpParams } from '@angular/common/http';
// import { Observable, BehaviorSubject } from 'rxjs';
// import { map, catchError } from 'rxjs/operators';
// import { 
//   HostVerification, 
//   AdminHostVerificationListDto, 
//   AdminHostVerificationResponseDto,
//   HostVerificationStatusUpdateDto,
//   VerificationFilters
// } from '../Models/admin-host-verification.model';

// @Injectable({
//   providedIn: 'root'
// })
// export class HostVerificationService {
//   private readonly baseUrl = 'https://localhost:7145/api'; // Replace with your actual API URL
//   private verificationsSubject = new BehaviorSubject<AdminHostVerificationListDto[]>([]);
//   public verifications$ = this.verificationsSubject.asObservable();

//   constructor(private http: HttpClient) {}

//   // Get all host verifications
//   getAllVerifications(): Observable<HostVerification[]> {
//     return this.http.get<HostVerification[]>(`${this.baseUrl}/HostVerification`)
//       .pipe(
//         catchError(this.handleError)
//       );
//   }

//   // Get all host verifications for admin (using admin endpoint)
//   getAllHostVerifications(): Observable<AdminHostVerificationListDto[]> {
//     return this.http.get<AdminHostVerificationListDto[]>(`${this.baseUrl}/Admin/host-verifications`)
//       .pipe(
//         map(verifications => {
//           this.verificationsSubject.next(verifications);
//           return verifications;
//         }),
//         catchError(this.handleError)
//       );
//   }

//   // Get verification by ID
//   getVerificationById(id: number): Observable<HostVerification> {
//     return this.http.get<HostVerification>(`${this.baseUrl}/HostVerification/${id}`)
//       .pipe(
//         catchError(this.handleError)
//       );
//   }

//   // Get admin verification by ID
//   getAdminVerificationById(id: number): Observable<AdminHostVerificationResponseDto> {
//     return this.http.get<AdminHostVerificationResponseDto>(`${this.baseUrl}/Admin/host-verifications/${id}`)
//       .pipe(
//         catchError(this.handleError)
//       );
//   }

//   // Get verifications by status
//   getVerificationsByStatus(status: string): Observable<HostVerification[]> {
//     return this.http.get<HostVerification[]>(`${this.baseUrl}/HostVerification/status/${status}`)
//       .pipe(
//         catchError(this.handleError)
//       );
//   }

//   // Get verifications by host ID
//   getVerificationsByHostId(hostId: number): Observable<HostVerification[]> {
//     return this.http.get<HostVerification[]>(`${this.baseUrl}/HostVerification/host/${hostId}`)
//       .pipe(
//         catchError(this.handleError)
//       );
//   }

//   // Approve host verification
//   approveVerification(id: number, request: HostVerificationStatusUpdateDto): Observable<any> {
//     return this.http.put(`${this.baseUrl}/Admin/host-verifications/${id}/approve`, request)
//       .pipe(
//         map(response => {
//           this.refreshVerifications();
//           return response;
//         }),
//         catchError(this.handleError)
//       );
//   }

//   // Reject host verification
//   rejectVerification(id: number, request: HostVerificationStatusUpdateDto): Observable<any> {
//     return this.http.put(`${this.baseUrl}/Admin/host-verifications/${id}/reject`, request)
//       .pipe(
//         map(response => {
//           this.refreshVerifications();
//           return response;
//         }),
//         catchError(this.handleError)
//       );
//   }

//   // Filter verifications
//   filterVerifications(filters: VerificationFilters): Observable<AdminHostVerificationListDto[]> {
//     let params = new HttpParams();
    
//     if (filters.status) {
//       params = params.set('status', filters.status);
//     }
//     if (filters.hostId) {
//       params = params.set('hostId', filters.hostId.toString());
//     }
//     if (filters.verificationType) {
//       params = params.set('verificationType', filters.verificationType);
//     }
//     if (filters.dateFrom) {
//       params = params.set('dateFrom', filters.dateFrom.toISOString());
//     }
//     if (filters.dateTo) {
//       params = params.set('dateTo', filters.dateTo.toISOString());
//     }

//     return this.http.get<AdminHostVerificationListDto[]>(`${this.baseUrl}/Admin/host-verifications`, { params })
//       .pipe(
//         catchError(this.handleError)
//       );
//   }

//   // Refresh verifications list
//   private refreshVerifications(): void {
//     this.getAllHostVerifications().subscribe();
//   }

//   // Error handler
//   private handleError = (error: any): Observable<never> => {
//     console.error('An error occurred:', error);
//     throw error;
//   };

//   // Get verification status color
//   getStatusColor(status: string): string {
//     switch (status.toLowerCase()) {
//       case 'approved':
//         return 'success';
//       case 'rejected':
//         return 'danger';
//       case 'pending':
//         return 'warning';
//       case 'under_review':
//         return 'info';
//       default:
//         return 'secondary';
//     }
//   }

//   // Get verification status icon
//   getStatusIcon(status: string): string {
//     switch (status.toLowerCase()) {
//       case 'approved':
//         return 'check-circle';
//       case 'rejected':
//         return 'x-circle';
//       case 'pending':
//         return 'clock';
//       case 'under_review':
//         return 'eye';
//       default:
//         return 'help-circle';
//     }
//   }
// }
// services/admin-host-verification.service.ts
// services/admin-host-verification.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { 
  HostVerification, 
  HostVerificationResponse,
  VerificationFilters
} from '../Models/admin-host-verification.model';

// DTO interface matching your controller's AdminNotesDto
export interface AdminNotesDto {
  adminNotes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class HostVerificationService {
  private readonly baseUrl = 'https://localhost:7145/api/HostVerification'; // Updated to match your controller
  private verificationsSubject = new BehaviorSubject<HostVerification[]>([]);
  public verifications$ = this.verificationsSubject.asObservable();

  constructor(private http: HttpClient) {}

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

  // Get verification by ID - matches [HttpGet("{id}")] GetVerificationById(int id)
  getVerificationById(id: number): Observable<HostVerification> {
    return this.http.get<HostVerification>(`${this.baseUrl}/${id}`)
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

  // Get verifications by host ID - matches [HttpGet("host/{hostId}")] GetVerificationsByHostId(int hostId)
  getVerificationsByHostId(hostId: number): Observable<HostVerification[]> {
    return this.http.get<HostVerification[]>(`${this.baseUrl}/host/${hostId}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Add host verification - matches [HttpPost] AddVerifications([FromForm] HostVerificationDTO? hostDto = null)
  addVerification(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}`, formData)
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