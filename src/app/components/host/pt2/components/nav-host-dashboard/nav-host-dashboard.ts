import { Component, HostListener } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-nav-host-dashboard',
  imports: [RouterLink, RouterModule],
  templateUrl: './nav-host-dashboard.html',
  styleUrl: './nav-host-dashboard.css'
})
export class NavHostDashboard {
 isDropdownOpen = false;

  constructor(private router: Router) {}

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
}
