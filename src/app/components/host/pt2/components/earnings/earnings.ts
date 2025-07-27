import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface MonthlyEarning {
  month: string;
  amount: number;
  isCurrentMonth: boolean;
}

interface EarningSummary {
  grossEarnings: number;
  adjustments: number;
  airbnbServiceFee: number;
  taxWithheld: number;
  total: number;
}

@Component({
  selector: 'app-earnings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './earnings.html',
  styleUrls: ['./earnings.css']
})
export class Earnings implements OnInit {
  currentMonthEarnings = 0.00;
  currentMonth = 'July';
  currentYear = 2025;
  
  // Dummy data for monthly earnings
  monthlyEarnings: MonthlyEarning[] = [
    { month: 'Jan', amount: 0, isCurrentMonth: false },
    { month: 'Feb', amount: 0, isCurrentMonth: false },
    { month: 'Mar', amount: 0, isCurrentMonth: false },
    { month: 'Apr', amount: 0, isCurrentMonth: false },
    { month: 'May', amount: 0, isCurrentMonth: false },
    { month: 'Jun', amount: 0, isCurrentMonth: false },
    { month: 'Jul', amount: 0, isCurrentMonth: true },
    { month: 'Aug', amount: 0, isCurrentMonth: false },
    { month: 'Sep', amount: 0, isCurrentMonth: false },
    { month: 'Oct', amount: 0, isCurrentMonth: false },
    { month: 'Nov', amount: 0, isCurrentMonth: false },
    { month: 'Dec', amount: 0, isCurrentMonth: false }
  ];

  // Year-to-date summary
  ytdSummary: EarningSummary = {
    grossEarnings: 0.00,
    adjustments: 0.00,
    airbnbServiceFee: 0.00,
    taxWithheld: 0.00,
    total: 0.00
  };

  // Date range for YTD
  ytdDateRange = `Jan 1 – ${this.currentMonth} 26, ${this.currentYear}`;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadEarningsData();
  }

  loadEarningsData(): void {
    // In a real app, this would call an earnings service
    // For now, we're using the dummy data initialized above
    
    // You could add API calls here like:
    // this.earningsService.getMonthlyEarnings().subscribe(data => {
    //   this.monthlyEarnings = data;
    // });
  }

  goToHostDashboard(): void {
    this.router.navigate(['/host/today']);
  }

  formatCurrency(amount: number): string {
    return `$${amount.toFixed(2)}`;
  }

  expandChart(): void {
    // Functionality to expand the chart view
    console.log('Expanding chart view...');
  }
}