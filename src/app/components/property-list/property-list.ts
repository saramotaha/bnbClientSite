import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HomeService } from '../../Core/Services/home-service';
import { IPropertyList } from '../../Core/Models/iproperty-list';
import { CommonModule } from '@angular/common';
import { FilterHomesServices } from '../../Core/Services/filter-homes-services';
import { Router } from '@angular/router';
import { FavoriteService } from '../../User/favorites/services/favorite.service';
import { AuthService } from '../../Pages/Auth/auth.service';
import { Loader } from "../loader/loader";
import { FormsModule } from '@angular/forms';
import { AverageRatingPipe } from '../../Admin/Pipes/average-rating-pipe';

@Component({
  selector: 'app-property-list',
  standalone: true,
  imports: [CommonModule, FormsModule, Loader, AverageRatingPipe],
  templateUrl: './property-list.html',
  styleUrls: ['./property-list.css']
})
export class PropertyList implements OnInit {
  selectedDate: Date = new Date();
  FilterPropertiesByCity: IPropertyList[] = [];
  FilterPropertiesInParisByAvailability: IPropertyList[] = [];
  FilterPropertiesInCairoByAvailability: IPropertyList[] = [];
  FilterPropertiesByCairo: IPropertyList[] = [];
  FilterPropertiesBySpain: IPropertyList[] = [];
  FilterPropertiesByUnitedStates: IPropertyList[] = [];
  Reviews!: number[];
  AllData: IPropertyList[] = [];
  AllCities: string[] = [];
  AllParisHomes: IPropertyList[] = [];
  isAnimating: boolean = false;


  constructor(
    private homeService: HomeService,
    private cdr: ChangeDetectorRef,
    private homes: FilterHomesServices,
    private router: Router,
    private favoriteService: FavoriteService,
    private authService: AuthService
  ) { }

  getNextWeekEndDays(): string[] {
    const dates: string[] = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + i);
      const day = nextDate.getDay();
      if (day === 5 || day === 6) {
        const formatted = nextDate.toISOString().split('T')[0];
        dates.push(formatted);
      }
    }
    return dates;
  }

  getNextMonthDates(): string[] {
    const today = new Date();
    const year = today.getMonth() === 11 ? today.getFullYear() + 1 : today.getFullYear();
    const nextMonth = (today.getMonth() + 1) % 12;
    const daysInNextMonth = new Date(year, nextMonth + 1, 0).getDate();

    const dates: string[] = [];
    for (let day = 1; day <= daysInNextMonth; day++) {
      const date = new Date(year, nextMonth, day);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  }

toggleFavorite(event: Event, property: IPropertyList): void {
  // Prevent event bubbling and card navigation
  event.stopPropagation();
  
  // Check if user is logged in
  const userId = this.authService.getUserId();
  if (!userId) {
    this.router.navigate(['/login']);
    return;
  }

  // Trigger animation
  property.isAnimating = true;
  
  // Remove animation class after it completes (600ms matches CSS animation duration)
  setTimeout(() => {
    property.isAnimating = false;
  }, 600);

  const numericUserId = parseInt(userId);

  if (property.IsFav) {
    // REMOVE from favorites
    this.favoriteService.removeFavorite(numericUserId, property.id).subscribe({
      next: () => {
        // Success - update UI state
        property.IsFav = false;
      },
      error: (error) => {
        console.error('Error removing favorite:', error);
        
        // Special case: Handle successful text responses that fail to parse
        if (error.status === 200 && error.error instanceof ProgressEvent) {
          property.IsFav = false; // Assume success if we got 200 status
        }
        // For other errors, don't change IsFav to keep UI consistent
      }
    });
  } else {
    // ADD to favorites
    this.favoriteService.addToFavorite(numericUserId, property.id).subscribe({
      next: () => {
        // Success - update UI state
        property.IsFav = true;
      },
      error: (error) => {
        console.error('Error adding favorite:', error);
        
        // Handle "already favorited" case
        if (error.status === 400 && error.error.includes('already favorited')) {
          property.IsFav = true; // Sync UI with backend state
        } else {
          property.IsFav = false; // Revert UI on other errors
        }
      }
    });
  }
}

  ParisHomes() {
    this.homes.setFilters({
      "location": "Paris"
    });
    this.router.navigate(['/ViewAllHomes']);
  }

  ParisHomesInWeekEnd() {
    this.homes.setFilters({
      "location": "Paris",
      "startDate": this.getNextWeekEndDays()[0],
      "endDate": this.getNextWeekEndDays()[1]
    });
    this.router.navigate(['/ViewAllHomes']);
  }

  UnitedHomes() {
    this.homes.setFilters({
      "location": "United States"
    });
    this.router.navigate(['/ViewAllHomes']);
  }

  CairoHomesNextMonth() {
    this.homes.setFilters({
      "location": "cairo",
      "startDate": this.getNextMonthDates()[0],
      "endDate": this.getNextMonthDates()[this.getNextMonthDates().length - 1]
    });
    this.router.navigate(['/ViewAllHomes']);
  }

  CairoHomes() {
    this.homes.setFilters({
      "location": "cairo"
    });
    this.router.navigate(['/ViewAllHomes']);
  }

  SpainHomes() {
    this.homes.setFilters({
      "location": "Spain"
    });
    this.router.navigate(['/ViewAllHomes']);
  }

  ngOnInit(): void {
    const nextWeekEndDays = this.getNextWeekEndDays();
    const nextMonthDates = this.getNextMonthDates();

    this.homeService.GetPopularHomes().subscribe({
      next: (response) => {
        this.AllData = response;

        for (let index = 0; index < this.AllData.length; index++) {
          if (!this.AllCities.includes(this.AllData[index].city))
            this.AllCities.push(this.AllData[index].city);
        }

        this.homeService.GetFavProp().subscribe({
          next: (fav) => {
            this.AllData.forEach(p => p.IsFav = fav.some(f => f.propertyId == p.id));
          }
        });

        this.FilterPropertiesBySpain = response.filter(x => 
          x?.country?.toLowerCase() == 'spain' && 
          x?.status?.toLowerCase() == 'active'
        ).slice(0, 8);

        this.FilterPropertiesByCity = this.AllData.filter(p => 
          p.city?.toLowerCase() === 'paris'?.toLowerCase()
        ).filter(x => x.status == 'active').slice(0, 8);

        this.FilterPropertiesInParisByAvailability = response.filter(property => {
          const isInParis = property.city?.toLowerCase() === 'paris';
          if (!isInParis) return false;
          const availableDates = property.availabilityDates?.some(a => {
            const formattedDate = a.date.split('T')[0];
            return nextWeekEndDays.includes(formattedDate) && a.isAvailable;
          });
          return availableDates;
        }).filter(x => x.status == 'active').slice(0, 8);

        this.FilterPropertiesByCairo = response.filter(p => 
          p.city.toLowerCase() == "cairo".toLowerCase()
        ).filter(x => x.status == 'active').slice(0, 8);

        this.FilterPropertiesByUnitedStates = response.filter(p => 
          p.country.toLowerCase() == 'United States'.toLowerCase()
        ).filter(x => x.status == 'active').slice(0, 8);

        this.FilterPropertiesInCairoByAvailability = response.filter(property => {
          const isInCairo = property.city?.toLowerCase() == 'cairo'.toLowerCase();
          if (!isInCairo) return false;
          const availableDates = property.availabilityDates?.some(a => {
            const formattedDate = a.date.split('T')[0];
            return nextMonthDates.includes(formattedDate) && a.isAvailable;
          });
          return availableDates;
        }).filter(x => x.status == 'active').slice(0, 8);

        this.cdr.detectChanges();
      }
    });
  }

  getPropertyId(id: number): void {
    this.router.navigate(['/propertyDetails', id]);
  }
}