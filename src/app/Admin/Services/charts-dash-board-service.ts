import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';

export interface ReviewStatsResponse {
  totalReviews: number
  avgRating: number
  reviewsPerMonth: Array<{
    year: number
    month: number
    count: number
  }>
}

export interface BookingStatsResponse {
  totalBookings: number
  monthlyBookings: Array<{
    year: number
    month: number
    count: number
  }>
}

export interface IncomeStatsResponse {
  income: number
  monthlyIncome: Array<{
    year: number
    month: number
    income: number
  }>
}

@Injectable({
  providedIn: 'root'
})
export class ChartsDashBoardService {

  private apiUrl: string = "https://your-api-url.com/api";

  constructor(private http: HttpClient) {}

  getReviewStats(): Observable<ReviewStatsResponse> {
    return this.http.get<ReviewStatsResponse>(`${this.apiUrl}/Dashboard/reviewStats`)
  }

  getBookingStats(): Observable<BookingStatsResponse> {
    return this.http.get<BookingStatsResponse>(`${this.apiUrl}/Dashboard/bookingStats`)
  }

  getHostingIncome(): Observable<IncomeStatsResponse> {
    return this.http.get<IncomeStatsResponse>(`${this.apiUrl}/Dashboard/hostingIncome`)
  }

  // Additional method to get all dashboard data at once
  getAllDashboardData(): Observable<{
    reviewStats: ReviewStatsResponse
    bookingStats: BookingStatsResponse
    incomeStats: IncomeStatsResponse
  }> {
    return forkJoin({
      reviewStats: this.getReviewStats(),
      bookingStats: this.getBookingStats(),
      incomeStats: this.getHostingIncome(),
    })
  }

}
