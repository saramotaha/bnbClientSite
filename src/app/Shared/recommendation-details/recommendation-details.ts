import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RecommendationService } from '../../Core/Services/Recommendation.service';
import { AuthService } from '../../Pages/Auth/auth.service';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { RecommendationModel } from '../../Core/Models/irecomm-model';
import { idata } from '../../Core/Models/ifilter-data';

@Component({
  selector: 'app-recommendation-details',
  standalone: true,
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
  recommendations: any[] = [];
  error: string | null = null;
  recommendedData!: idata[];

  constructor(
    public dialogRef: MatDialogRef<RecommendationDetails>,
    private recommendationService: RecommendationService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadRecommendations();
    this.filterRecommendations();
    
  }

  loadRecommendations(): void {
    this.error = null;
    this.recommendations = [];

    if (!this.authService.isAuthenticated()) {
      this.error = 'Please sign in to view recommendations';
      return;
    }

    const userId = this.authService.getUserId();
    if (!userId) {
      this.error = 'Unable to determine user ID';
      return;
    }

    this.recommendationService.getRecommendations(userId).subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          console.log(data)
          this.recommendations = data;
        this.cdr.detectChanges();
        }
      },
      error: (err) => {
        this.error = 'Failed to load recommendations';
      }
    });
  }

  filterRecommendations(): void {
  const storedPrefs = localStorage.getItem("userPreferences");
  console.log("Raw localStorage data:", storedPrefs);

  if (!storedPrefs) {
    console.warn("No preferences found in local storage");
    this.error = 'Please set your preferences first';
    return;
  }

  try {
    const parsedPrefs = JSON.parse(storedPrefs);
    console.log("Parsed preferences:", parsedPrefs);

    // Transform data to match API expectations
    const apiBody: RecommendationModel = {
      preferredCity: parsedPrefs.preferredCity || '', // Ensure string
      budgetForNight: Number(parsedPrefs.budgetForNight) || 0, // Convert to number
      maxGuest: Number(parsedPrefs.MaxGuest || parsedPrefs.maxGuest) || 1, // Handle both cases and default to 1
      propertyType: parsedPrefs.propertyType || 'Any' // Default value
    };

    console.log("API Request Body:", apiBody);

    this.recommendationService.getfilterRecommendations(apiBody).subscribe({
      next: (response) => {
        this.recommendedData = response;
        console.log("Filtered Recommendations:", response);
      },
      error: (err) => {
        console.error("API Error:", err);
        this.error = 'Failed to get recommendations. Please check your preferences.';
        if (err.error) {
          console.error("Server error details:", err.error);
        }
      }
    });
  } catch (e) {
    console.error("Error parsing preferences:", e);
    this.error = 'Invalid preferences format';
  }
}

  refreshRecommendations(): void {
    this.loadRecommendations();
  }

  navigateToProperty(propertyId: number): void {
    this.dialogRef.close();
    this.router.navigate(['/properties', propertyId]);
  }

  navigateToProfileInfo(): void {
    this.dialogRef.close();
    this.router.navigate(['/UserProfile/profileInfo']);
  }

}