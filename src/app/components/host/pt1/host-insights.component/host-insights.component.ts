import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { take } from 'rxjs/operators';
import Chart from 'chart.js/auto';
import { AuthService } from '../../../../Pages/Auth/auth.service';

interface HostInsights {
  hostId: number;
  propertyCount: number;
  availableBalance: number;
  totalEarnings: number;
  totalCompletedPayouts: number;
  totalProcessingPayouts: number;
  totalCompleted: number;
  totalProcessing: number;
}

@Component({
  selector: 'app-host-insights',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './host-insights.component.html',
  styleUrls: ['./host-insights.component.css']
})
export class HostInsightsComponent implements OnInit {
  hostId: string | null = null; // Changed from number to string | null
  insights: HostInsights | null = null;
  loading = true;
  baseUrl = 'http://localhost:7145';

  @ViewChild('earningsChart') earningsChartRef!: ElementRef;
  @ViewChild('bookingsChart') bookingsChartRef!: ElementRef;
  @ViewChild('payoutsChart') payoutsChartRef!: ElementRef;

  earningsChart!: Chart;
  bookingsChart!: Chart;
  payoutsChart!: Chart;

  cardItems: {
    label: string;
    value: number;
    icon: string;
    class: string;
    suffix?: string;
  }[] = [];

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private authService: AuthService // Injected AuthService
  ) {}

  ngOnInit(): void {
    this.hostId = this.authService.getHostId(); // Get hostId from AuthService
    if (this.hostId) {
      this.getHostInsights();
    } else {
      console.error('No hostId available');
      this.loading = false;
    }
  }

  getHostInsights(): void {
    if (!this.hostId) return;
    
    this.http.get<HostInsights>(`${this.baseUrl}/api/host/${this.hostId}/insights`)
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          this.insights = data;
          this.buildCards();
          this.loading = false;
          this.cdr.detectChanges();

          setTimeout(() => {
            if (
              this.earningsChartRef?.nativeElement &&
              this.bookingsChartRef?.nativeElement &&
              this.payoutsChartRef?.nativeElement
            ) {
              this.initCharts();
            } else {
              console.warn('⚠️ ViewChild refs are not yet ready.');
            }
          }, 200);
        },
        error: (err) => {
          console.error('❌ Failed to load insights:', err);
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }

  buildCards(): void {
    if (!this.insights) return;

    this.cardItems = [
      {
        label: 'Total Earnings',
        value: this.insights.totalEarnings,
        icon: '💰',
        class: 'bg-success bg-gradient',
        suffix: 'EGP'
      },
      {
        label: 'Property Count',
        value: this.insights.propertyCount,
        icon: '🏡',
        class: 'bg-primary bg-gradient'
      },
      {
        label: 'Completed Payouts',
        value: this.insights.totalCompletedPayouts,
        icon: '📈',
        class: 'bg-info bg-gradient',
        suffix: 'EGP'
      },
      {
        label: 'Processing Payouts',
        value: this.insights.totalProcessingPayouts,
        icon: '🔄',
        class: 'bg-warning bg-gradient',
        suffix: 'EGP'
      },
      {
        label: 'Available Balance',
        value: this.insights.availableBalance,
        icon: '🔒',
        class: 'bg-secondary bg-gradient',
        suffix: 'EGP'
      },
      {
        label: 'Completed Bookings',
        value: this.insights.totalCompleted,
        icon: '✅',
        class: 'bg-dark bg-gradient'
      },
      {
        label: 'Processing Bookings',
        value: this.insights.totalProcessing,
        icon: '⏳',
        class: 'bg-dark text-dark bg-gradient'
      }
    ];
  }

  initCharts(): void {
    if (!this.insights) return;

    // Destroy previous charts if any
    this.earningsChart?.destroy();
    this.bookingsChart?.destroy();
    this.payoutsChart?.destroy();

    this.earningsChart = new Chart(this.earningsChartRef.nativeElement, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Earnings',
          data: [5000, 7000, 4000, 8000, 6500, this.insights.totalEarnings],
          borderColor: '#28a745',
          backgroundColor: 'rgba(40, 167, 69, 0.2)',
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } }
      }
    });

    this.bookingsChart = new Chart(this.bookingsChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Completed', 'Processing'],
        datasets: [{
          label: 'Bookings',
          data: [this.insights.totalCompleted, this.insights.totalProcessing],
          backgroundColor: ['#0d6efd', '#ffc107']
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } }
      }
    });

    this.payoutsChart = new Chart(this.payoutsChartRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Completed', 'Processing'],
        datasets: [{
          label: 'Payouts',
          data: [this.insights.totalCompletedPayouts, this.insights.totalProcessingPayouts],
          backgroundColor: ['#20c997', '#ffc107']
        }]
      },
      options: {
        responsive: true
      }
    });
  }
}