import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ViolationService } from '../../services/violation.service';
import { ViolationDetailsDTO } from '../../models/violation.model';

@Component({
  selector: 'app-violations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './violations.html',
  styleUrls: ['./violations.css']
})
export class Violations implements OnInit {
  selectedTab: string = 'all';
  violations: ViolationDetailsDTO[] = [];
  filteredViolations: ViolationDetailsDTO[] = [];
  isLoading = true;
  error: string | null = null;

  // Dummy data for development
  dummyViolations: ViolationDetailsDTO[] = [
    {
      id: 1,
      violationType: 'Property Safety',
      status: 'Pending',
      description: 'Smoke detector not functioning properly in the main bedroom',
      createdAt: '2025-01-15T10:30:00Z',
      updatedAt: '2025-01-15T10:30:00Z',
      reporter: {
        id: 101,
        fullName: 'Sarah Johnson',
        profilePictureUrl: 'https://images.unsplash.com/photo-1494790108755-2616b332c3a4?w=150&h=150&fit=crop&crop=face',
        role: 'guest',
        emailVerified: true
      },
      property: {
        id: 201,
        title: 'Cozy Downtown Apartment',
        city: 'New York',
        country: 'United States',
        status: 'active',
        primaryImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop'
      }
    },
    {
      id: 2,
      violationType: 'House Rules',
      status: 'Under Review',
      description: 'Guests were smoking inside the property despite no-smoking policy',
      createdAt: '2025-01-12T14:22:00Z',
      updatedAt: '2025-01-13T09:15:00Z',
      adminNotes: 'Investigating with additional evidence requested',
      reporter: {
        id: 102,
        fullName: 'Michael Chen',
        profilePictureUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        role: 'host',
        emailVerified: true
      },
      property: {
        id: 202,
        title: 'Modern Studio in SoHo',
        city: 'New York',
        country: 'United States',
        status: 'active',
        primaryImage: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop'
      }
    },
    {
      id: 3,
      violationType: 'Cleanliness',
      status: 'Resolved',
      description: 'Property was not cleaned properly before check-in',
      createdAt: '2025-01-08T16:45:00Z',
      updatedAt: '2025-01-10T11:30:00Z',
      resolvedAt: '2025-01-10T11:30:00Z',
      adminNotes: 'Issue resolved. Host provided cleaning service details and guest satisfaction confirmed.',
      reporter: {
        id: 103,
        fullName: 'Emma Williams',
        profilePictureUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        role: 'guest',
        emailVerified: true
      },
      property: {
        id: 203,
        title: 'Luxury Penthouse Suite',
        city: 'Los Angeles',
        country: 'United States',
        status: 'active',
        primaryImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop'
      }
    }
  ];

  constructor(private violationService: ViolationService, private router: Router) {}

  ngOnInit(): void {
    this.loadViolations();
  }

  loadViolations(): void {
    this.isLoading = true;
    this.error = null;

    // Try to load from API, fallback to dummy data
    this.violationService.getAll().subscribe({
      next: (data) => {
        this.violations = data;
        this.filterViolations();
        this.isLoading = false;
      },
      error: (err) => {
        console.warn('API call failed, using dummy data:', err);
        // Fallback to dummy data
        this.violations = this.dummyViolations;
        this.filterViolations();
        this.isLoading = false;
      }
    });
  }

  selectTab(tab: string): void {
    this.selectedTab = tab;
    this.filterViolations();
  }

  filterViolations(): void {
    switch (this.selectedTab) {
      case 'pending':
        this.filteredViolations = this.violations.filter(v => v.status === 'Pending');
        break;
      case 'under-review':
        this.filteredViolations = this.violations.filter(v => v.status === 'Under Review');
        break;
      case 'resolved':
        this.filteredViolations = this.violations.filter(v => v.status === 'Resolved');
        break;
      default:
        this.filteredViolations = this.violations;
    }
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'status-pending';
      case 'under review':
        return 'status-under-review';
      case 'resolved':
        return 'status-resolved';
      default:
        return 'status-default';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  updateViolationStatus(violationId: number, newStatus: string): void {
    this.violationService.updateStatus(violationId, newStatus).subscribe({
      next: (response) => {
        console.log('Status updated:', response);
        // Update local data
        const violation = this.violations.find(v => v.id === violationId);
        if (violation) {
          violation.status = newStatus;
          violation.updatedAt = new Date().toISOString();
          if (newStatus === 'Resolved') {
            violation.resolvedAt = new Date().toISOString();
          }
        }
        this.filterViolations();
      },
      error: (err) => {
        console.error('Failed to update status:', err);
        this.error = 'Failed to update violation status';
      }
    });
  }

  goToHostDashboard(): void {
    this.router.navigate(['/host/today']);
  }
}