import { Component, HostListener } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../../../../Pages/Auth/auth.service';
@Component({
  selector: 'app-nav-host-dashboard',
  imports: [RouterLink, RouterModule],
  templateUrl: './nav-host-dashboard.html',
  styleUrl: './nav-host-dashboard.css'
})
export class NavHostDashboard {
 isDropdownOpen = false;
hostFname = '';
hostLname = '';

  constructor(private router: Router, private authService: AuthService) {}

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
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

  navigateTo(route: string): void {
    this.router.navigate([route]);
    this.closeDropdown();
  }

  profileInitials(): string {
  let initials = 'P'; // Default fallback

  this.authService.currentUser$.subscribe(user => {
    const first = user?.firstName?.charAt(0).toUpperCase() || '';
    const last = user?.lastName?.charAt(0).toUpperCase() || '';

    if (first || last) {
      initials = `${first}${last}`;
    }
  });

  return initials;
}

}
