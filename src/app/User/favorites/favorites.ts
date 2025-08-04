import { Component, OnInit } from '@angular/core';
import { Ifavorite } from './models/ifavorite';
import { FavoriteService } from './services/favorite.service';
import { FavoriteCard } from './favorite-card/favorite-card';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../Pages/Auth/auth.service';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, FavoriteCard, MatSnackBarModule],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css'
})
export class Favorites implements OnInit {
   favorites: Ifavorite[] = [];
  userId: number | null = null;

  constructor(
    private favoriteService: FavoriteService,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Get the user ID from your auth service
    const userIdString = this.authService.getUserId();
     if (userIdString) {
      this.userId = Number(userIdString);
      if (!isNaN(this.userId)) {
        this.loadFavorites();
        return;
      }
    }
      this.snackBar.open('Please login to view favorites', '', { duration: 3000 });
  }

// In your loadFavorites() method
loadFavorites() {
  if (!this.userId) return;

  console.log('Loading favorites for user:', this.userId);
  
  this.favoriteService.getFavorites(this.userId).subscribe({
    next: (response) => {
      console.log('Full API response:', response);
      
      // Check if response is an array
      if (!Array.isArray(response)) {
        console.error('Expected array but got:', typeof response);
        return;
      }
      
      // Log first item structure
      if (response.length > 0) {
        console.log('First favorite item structure:', response[0]);
      }
      
      this.favorites = response;
    },
    error: (err) => {
      console.error('API Error:', err);
    }
  });
}

  removeFavorite(item: Ifavorite, index: number) {
    if (!this.userId) return;
    
    this.favoriteService.removeFavorite(this.userId, item.propertyId).subscribe({
      next: () => {
        const deleted = this.favorites.splice(index, 1)[0];
        this.snackBar.open('Removed from favorites', '', { duration: 3000 });
      },
      error: (err) => {
        console.error('Failed to remove favorite:', err);
        this.snackBar.open('Failed to remove favorite', '', { duration: 3000 });
      }
    });
  }
}

