import { AuthService } from './../../../../../Pages/Auth/auth.service';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { Notifications } from "../../../../../User/notifications/notifications";

@Component({
  selector: 'app-nav-host-dashboard',
  standalone: true,
  imports: [RouterLink, RouterModule, CommonModule, Notifications],
  templateUrl: './nav-host-dashboard.html',
  styleUrl: './nav-host-dashboard.css',
  providers: [DatePipe]
})
export class NavHostDashboard implements OnInit, OnDestroy {
  isDropdownOpen = false;
  hostFname = '';
  hostLname = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    // Load host profile data if needed
    const user = this.authService.currentUser;
    if (user) {
      this.hostFname = user.firstName || '';
      this.hostLname = user.lastName || '';
    }
  }

  ngOnDestroy(): void {}

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
    this.closeDropdown();
  }

  profileInitials(): string {
    const user = this.authService.currentUser;
    if (!user) return 'P';

    const first = user.firstName?.charAt(0).toUpperCase() || '';
    const last = user.lastName?.charAt(0).toUpperCase() || '';
    return first + last || 'P';
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    const menuContainer = document.querySelector('.menu-container');
    
    if (menuContainer && !menuContainer.contains(target)) {
      this.closeDropdown();
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    this.closeDropdown();
  }
}