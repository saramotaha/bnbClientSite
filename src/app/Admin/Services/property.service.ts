import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, timeout } from 'rxjs/operators';
import { 
  AdminPropertyListDto, 
  AdminPropertyResponseDto, 
  PropertyStatusUpdateDto, 
  PropertySoftDeleteDto,
  PropertyDetailDto // Add this new interface
} from '../Models/Property.model';

@Injectable({
  providedIn: 'root',
})
export class PropertyService {
  // IMPORTANT: Replace with your actual backend API URL.
  private readonly apiUrl = 'http://localhost:7145/api/admin';
  private readonly publicApiUrl = 'http://localhost:7145/api/Property'; // Add public API URL
  
  // Default HTTP options
  private readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(private http: HttpClient) {
    console.log('🔧 PropertyService initialized with API URLs:', {
      adminApi: this.apiUrl,
      publicApi: this.publicApiUrl
    });
  }

  /**
   * Fetches all properties from the admin endpoint.
   * Corresponds to: [HttpGet("properties")] in AdminController
   * Returns AdminPropertyListDto[] from the backend
   */
  getAllProperties(): Observable<AdminPropertyListDto[]> {
    console.log(' Fetching all properties from:', `${this.apiUrl}/properties`);
    
    return this.http.get<AdminPropertyListDto[]>(`${this.apiUrl}/properties`, this.httpOptions).pipe(
      timeout(30000), // 30 second timeout
      tap((properties) => {
        console.log(' Successfully fetched properties:', properties.length);
        console.log('First property sample:', properties[0] || 'No properties found');
        
        // Log property statuses for debugging
        const statusCounts = properties.reduce((acc, prop) => {
          acc[prop.status] = (acc[prop.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        console.log('Property status distribution:', statusCounts);
      }),
      catchError((error) => this.handleError(error, 'getAllProperties'))
    );
  }

  /**
   * Fetches a single property by its ID from admin endpoint.
   * Corresponds to: [HttpGet("properties/{id}")] in AdminController
   * Returns AdminPropertyResponseDto from the backend
   */
  getPropertyById(id: number): Observable<AdminPropertyResponseDto> {
    console.log(' Fetching property by ID from admin endpoint:', id);
    
    return this.http.get<AdminPropertyResponseDto>(`${this.apiUrl}/properties/${id}`, this.httpOptions).pipe(
      timeout(30000),
      tap((property) => {
        console.log(' Successfully fetched property from admin endpoint:', {
          id: property.id,
          title: property.title,
          status: property.status,
          adminNotes: property.adminNotes
        });
      }),
      catchError((error) => this.handleError(error, 'getPropertyById', { id }))
    );
  }

  /**
   * NEW METHOD: Fetches detailed property information from the public Property controller.
   * Corresponds to: [HttpGet("{id}")] in PropertyController
   * Returns PropertyDetailDto from the backend
   */
  getPropertyDetails(id: number): Observable<PropertyDetailDto> {
    console.log(' Fetching detailed property information from public API:', id);
    
    return this.http.get<PropertyDetailDto>(`${this.publicApiUrl}/${id}`, this.httpOptions).pipe(
      timeout(30000),
      tap((property) => {
        console.log(' Successfully fetched detailed property information:', {
          id: property.id,
          title: property.title,
          description: property.description,
          amenities: property.amenities?.length || 0,
          images: property.images?.length || 0,
          host: property.hostName
        });
      }),
      catchError((error) => this.handleError(error, 'getPropertyDetails', { id }))
    );
  }

  /**
   * Updates the status of a specific property.
   * Corresponds to: [HttpPut("properties/{id}/status")]
   */
  updatePropertyStatus(id: number, request: PropertyStatusUpdateDto): Observable<any> {
    const url = `${this.apiUrl}/properties/${id}/status`;
    
    console.log(' Updating property status:', {
      url,
      propertyId: id,
      payload: request,
      headers: this.httpOptions.headers
    });
    
    // Validate the request payload
    if (!request || !request.status) {
      console.error(' Invalid payload for status update:', request);
      return throwError(() => new Error('Invalid status update payload'));
    }
    
    // Validate the status value
    const validStatuses = ['active', 'rejected', 'suspended'];
    if (!validStatuses.includes(request.status)) {
      console.error(' Invalid status value:', request.status);
      return throwError(() => new Error(`Invalid status: ${request.status}. Must be one of: ${validStatuses.join(', ')}`));
    }

    return this.http.put<any>(url, request, this.httpOptions).pipe(
      timeout(30000),
      tap((response) => {
        console.log(' Status update successful:', {
          propertyId: id,
          newStatus: request.status,
          adminNotes: request.adminNotes,
          response
        });
      }),
      catchError((error) => this.handleError(error, 'updatePropertyStatus', { id, request }))
    );
  }

  /**
   * Soft deletes a property by its ID.
   * Corresponds to: [HttpPut("properties/{id}/soft-delete")]
   * This suspends the property instead of permanently deleting it
   */
  softDeleteProperty(id: number, adminNotes?: string): Observable<any> {
    const url = `${this.apiUrl}/properties/${id}/soft-delete`;
    const payload: PropertySoftDeleteDto = {
      adminNotes: adminNotes || 'Property suspended by admin'
    };
    
    console.log(' Soft deleting property:', {
      url,
      propertyId: id,
      payload,
      headers: this.httpOptions.headers
    });

    return this.http.put<any>(url, payload, this.httpOptions).pipe(
      timeout(30000),
      tap((response) => {
        console.log(' Property soft deletion successful:', {
          propertyId: id,
          adminNotes: payload.adminNotes,
          response
        });
      }),
      catchError((error) => this.handleError(error, 'softDeleteProperty', { id, payload }))
    );
  }

  /**
   * Legacy method for backward compatibility
   * Maps to soft delete functionality
   */
  deleteProperty(id: number): Observable<any> {
    console.log(' Using legacy deleteProperty method - mapping to soft delete');
    return this.softDeleteProperty(id, 'Property deleted via legacy method');
  }

  /**
   * Enhanced error handling function with detailed logging and context.
   */
  private handleError(error: HttpErrorResponse, operation: string, context?: any) {
    console.error(` ${operation} failed:`, error);
    
    // Log the context if provided
    if (context) {
      console.error('Operation context:', context);
    }
    
    // Log detailed error information
    console.error('Error details:', {
      status: error.status,
      statusText: error.statusText,
      message: error.message,
      url: error.url,
      error: error.error,
      headers: error.headers,
      name: error.name,
      ok: error.ok,
      type: error.type
    });

    let errorMessage = 'An unknown error occurred!';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Client Error: ${error.error.message}`;
      console.error('Client-side error occurred:', error.error.message);
    } else {
      // Server-side error
      console.error('Server-side error occurred:', {
        status: error.status,
        body: error.error
      });
      
      // Handle specific HTTP status codes
      switch (error.status) {
        case 0:
          errorMessage = 'Cannot connect to server. Please check your internet connection and ensure the server is running.';
          console.error('🔌 Connection failed - server may be down or CORS issues');
          break;
        case 400:
          // Handle ModelState validation errors
          if (error.error && typeof error.error === 'object') {
            const validationErrors = Object.values(error.error).flat();
            errorMessage = `Bad Request: ${validationErrors.join(', ')}`;
          } else {
            errorMessage = `Bad Request: ${error.error?.message || error.message || 'Invalid request data'}`;
          }
          console.error(' Bad request - check request payload and validation');
          break;
        case 401:
          errorMessage = 'Unauthorized. Please check your authentication credentials.';
          console.error(' Unauthorized - authentication required');
          break;
        case 403:
          errorMessage = 'Forbidden. You do not have permission to perform this action.';
          console.error(' Forbidden - insufficient permissions');
          break;
        case 404:
          errorMessage = `Resource not found: ${error.error?.message || 'The requested resource could not be found'}`;
          console.error(' Not found - check if the resource exists');
          break;
        case 409:
          errorMessage = `Conflict: ${error.error?.message || 'The request conflicts with current state'}`;
          console.error(' Conflict - resource state conflict');
          break;
        case 422:
          errorMessage = `Validation Error: ${error.error?.message || 'Invalid data provided'}`;
          console.error(' Validation failed - check data format');
          break;
        case 500:
          // Handle the specific error message format from your controller
          const serverMessage = error.error?.message || error.message;
          if (serverMessage && serverMessage.includes('Internal server error:')) {
            errorMessage = serverMessage;
          } else {
            errorMessage = `Server Error: ${serverMessage || 'Internal server error occurred'}`;
          }
          console.error(' Internal server error - check server logs');
          break;
        case 502:
          errorMessage = 'Bad Gateway. The server is temporarily unavailable.';
          console.error(' Bad gateway - server connectivity issues');
          break;
        case 503:
          errorMessage = 'Service Unavailable. The server is temporarily overloaded.';
          console.error(' Service unavailable - server overloaded');
          break;
        case 504:
          errorMessage = 'Gateway Timeout. The server took too long to respond.';
          console.error(' Gateway timeout - server response too slow');
          break;
        default:
          errorMessage = `HTTP ${error.status}: ${error.error?.message || error.message || error.statusText}`;
          console.error(` HTTP ${error.status} error occurred`);
      }
    }
    
    console.error(`Final error message for ${operation}:`, errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}