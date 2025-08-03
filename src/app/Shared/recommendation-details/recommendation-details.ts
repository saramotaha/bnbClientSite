import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { RecommendationService } from '../../Core/Services/Recommendation.service';
import { AuthService } from '../../Pages/Auth/auth.service';

@Component({
  selector: 'app-recommendation-details',
  standalone: true,  // <-- This is crucial for Angular 15+ components
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatCardModule
  ],
  templateUrl: './recommendation-details.html',
  styleUrls: ['./recommendation-details.css']
})
export class RecommendationDetails implements OnInit {
  isLoading: boolean = false;
  recommendations: any[] = [];
  error: string | null = null;

  constructor(public dialogRef: MatDialogRef<RecommendationDetails>,
    private recommendationService: RecommendationService,
    private authService: AuthService,
    private router: Router

  ) {}

  ngOnInit(): void {
    this.loadRecommendations();
  }

  loadRecommendations(): void {
     this.isLoading = true;
    this.error = null;
    setTimeout(()=>{
 if (!this.authService.isAuthenticated()) {
      this.error = 'Please sign in to view recommendations';
      this.isLoading = false;
      return;
    }
        const userId = this.authService.getUserId();
         if (!userId) {
      this.error = 'Unable to determine user ID';
      this.isLoading = false;
      return;
    }
     this.recommendationService.getRecommendations(userId).subscribe({
      next: (data) => {
        this.recommendations = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load recommendations';
        this.isLoading = false;
        console.error(err);
      }
    });
    })
  }

  refreshRecommendations(): void {
    this.loadRecommendations();
  }
  navigateToProperty(propertyId: number): void {
    this.dialogRef.close();
    this.router.navigate(['/properties', propertyId]);
  }
  navigateToLogin(): void {
  this.dialogRef.close(); // Close the recommendations dialog
  this.router.navigate(['/login']);
}
}