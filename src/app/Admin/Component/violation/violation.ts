import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ViolationService } from '../../Services/violation-service';
import { IPViolation } from '../../Models/ipviolation';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-violation',
  imports: [CommonModule,FormsModule],
  templateUrl: './violation.html',
  styleUrl: './violation.css'
})
export class Violation implements OnInit {

  AllViolation: IPViolation[] = [];
  PendingViolation: number = 0;
  ResolvedViolation: number = 0;
  RejectedViolation: number = 0;
  ViolationById?: IPViolation;
  searchKeyword: string = '';
selectedStatus: string = 'All';
filteredViolations: IPViolation[] = []; // For displaying filtered results

  constructor(private violationService: ViolationService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.loadViolations();
  }

  // ✅ Load Violations & Count
  loadViolations() {
  this.violationService.GetAllViolations().subscribe({
    next: (response) => {
      this.AllViolation = response;
      this.filteredViolations = [...this.AllViolation]; // ✅ Initialize filtered list
      this.updateCounts();
      this.cdr.detectChanges();
    }
  });
}

  onSearchChange() {
  this.applyFilters();
}

// ✅ Filter by Status
onStatusChange(event: any) {
  this.selectedStatus = event.target.value;
  this.applyFilters();
}

// ✅ Apply Filters (Search + Status)
applyFilters() {
  this.filteredViolations = this.AllViolation.filter(item => {
    const matchesSearch = this.searchKeyword
      ? item.description.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
        item.reporter.fullName.toLowerCase().includes(this.searchKeyword.toLowerCase())
      : true;

    const matchesStatus =
      this.selectedStatus === 'All' || item.status === this.selectedStatus;

    return matchesSearch && matchesStatus;
  });
}


  // ✅ Toggle View Details
  GetDetails(id: number) {
    if (this.ViolationById?.id === id) {
      this.ViolationById = undefined; // Hide if clicked again
    } else {
      this.violationService.GetViolationById(id).subscribe({
        next: (response) => {
          this.ViolationById = response;
          this.cdr.detectChanges();
        }
      });
    }
  }

  // ✅ Change Status & Update Locally
  updateStatus(id: number, newStatus: string) {
    const stringifiedStatus = JSON.stringify(newStatus);
    this.violationService.EditViolationStatus(id, stringifiedStatus).subscribe({
      next: () => {
        // Update in AllViolation
        const violation = this.AllViolation.find(v => v.id === id);
        if (violation) {
          violation.status = newStatus;
        }

        // If details are open, update it too
        if (this.ViolationById?.id === id) {
          this.ViolationById.status = newStatus;
        }

        // Update counts
        this.updateCounts();
        this.cdr.detectChanges();
      }
    });
  }

  Reject(id: number) {
    this.updateStatus(id, 'Dismissed');
  }

  UnderReview(id: number) {
    this.updateStatus(id, 'UnderReview');
  }

  StatusToResolved(id: number) {
    this.updateStatus(id, 'Resolved');
  }

  // ✅ Update Summary Counts
  updateCounts() {
    this.PendingViolation = this.AllViolation.filter(x => x.status === 'Pending').length;
    this.ResolvedViolation = this.AllViolation.filter(x => x.status === 'Resolved').length;
    this.RejectedViolation = this.AllViolation.filter(x => x.status === 'Dismissed').length;
  }



}
