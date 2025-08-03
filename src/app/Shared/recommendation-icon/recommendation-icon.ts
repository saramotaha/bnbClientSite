import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, NavigationEnd } from '@angular/router';
import { RecommendationDetails } from '../recommendation-details/recommendation-details';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-recommendation-icon',
  imports:[CommonModule, MatDialogModule,
    MatIconModule,
    MatButtonModule],
  templateUrl: './recommendation-icon.html',
  styleUrls: ['./recommendation-icon.css']
})
export class RecommendationIcon implements OnInit {
  shouldShowIcon: boolean = true;
  excludedRoutes = ['/login', '/register', '/auth/login', '/auth/register'];

  constructor(private router: Router, private dialog: MatDialog) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.shouldShowIcon = !this.isExcludedRoute(event.urlAfterRedirects);
      }
    });
  }

  private isExcludedRoute(url: string): boolean {
    return this.excludedRoutes.some(route => url.startsWith(route));
  }
openRecommendationModal() {
  this.dialog.open(RecommendationDetails, {
    width: '350px',
    position: {
      bottom: '80px',
      right: '24px'
    },
    panelClass: 'bottom-right-dialog'
  });
}
}