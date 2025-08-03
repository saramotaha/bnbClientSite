import { Component, OnInit } from '@angular/core';
import { Ifavorite } from './models/ifavorite';
import { FavoriteService } from './services/favorite.service';
import { FavoriteCard } from './favorite-card/favorite-card';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, FavoriteCard, MatSnackBarModule],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css'
})
export class Favorites implements OnInit {
  favorites: Ifavorite[] = [];

  constructor(
    private FavoriteService: FavoriteService,
    private snackBar: MatSnackBar
  ) {}
ngOnInit(): void {
  this.FavoriteService.getFavorites().subscribe({
    next: (data) => {
      console.log('Favorites loaded:', data);
      this.favorites = data;
    },
    error: (err) => {
      console.error('Failed to load favorites:', err);
    }
  });
}

removeFavorite(item: Ifavorite, index: number) {
  console.log('Removing from parent:', item); // Debug

  this.FavoriteService.removeFavorite(item.propertyId).subscribe({
    next: () => {
      const deleted = this.favorites.splice(index, 1)[0];

      this.snackBar.open('Removed from favorites')
        .onAction().subscribe(() => {
          this.favorites.splice(index, 0, deleted);
          
        });
    },
    error: (err) => {
  console.error('Failed to remove favorite:', err);
  console.error('Error status:', err.status);
  console.error('Error message:', err.message);
  console.error('Error body:', err.error);

  this.snackBar.open('Failed to remove favorite', '', { duration: 3000 });
}

  });
}

}

