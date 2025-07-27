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

  constructor(private violationService: ViolationService, private router: Router) {}

  ngOnInit(): void {
    this.fetchHostViolations(); // Loads host-specific data
  }

  fetchHostViolations(): void {
    this.isLoading = true;
    this.error = null;

    // Use host ID from auth service or hardcoded fallback
    this.violationService.getViolationsForCurrentHost().subscribe({
      next: (data) => {
        this.violations = data;
        this.filterViolations();
        setTimeout(() => {
          this.isLoading = false;
        }); // Ensures change detection after async call
      },
      error: (err) => {
        console.warn('API call failed:', err);
        this.error = 'Failed to load violations';
        setTimeout(() => {
          this.isLoading = false;
        });
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

  goToHostDashboard(): void {
    this.router.navigate(['/host/today']);
  }
}
