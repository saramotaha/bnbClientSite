import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HomeService } from '../../Core/Services/home-service';
import { IPropertyList } from '../../Core/Models/iproperty-list';
import { CommonModule } from '@angular/common';
import { FilterHomesServices } from '../../Core/Services/filter-homes-services';
import { Router } from '@angular/router';


@Component({
  selector: 'app-property-list',
  standalone:true,
  imports: [CommonModule ],
  templateUrl: './property-list.html',
  styleUrls: ['./property-list.css']
})
export class PropertyList implements OnInit {

  FilterPropertiesByCity: IPropertyList[] = [];
  FilterPropertiesInParisByAvailability: IPropertyList[] = [];
  FilterPropertiesInCairoByAvailability: IPropertyList[] = [];
  FilterPropertiesByCairo: IPropertyList[] = [];
  FilterPropertiesBySpain: IPropertyList[] = [];
  FilterPropertiesByUnitedStates: IPropertyList[] = [];
  Reviews!: number[];
  AllData: IPropertyList[] = [];
  AllParisHomes: IPropertyList[] = [];

  getNext7Days(): string[] {
  const dates: string[] = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + i);
    const day = nextDate.getDay(); // 5 = Friday, 6 = Saturday
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
    dates.push(date.toISOString().split('T')[0]); // YYYY-MM-DD
  }
  return dates;
  }





  ParisHomes() {

    this.homes.Filters = {
      "location": "Paris"
    };

    this.router.navigate(['/ViewAllHomes']);
  }


  ParisHomesInWeekEnd() {
    this.homes.Filters = {
      "location": "Paris",
      "startDate":this.getNext7Days()[0],
      "endDate": this.getNext7Days()[1]
    };


    this.router.navigate(['/ViewAllHomes']);
  }


  UnitedHomes() {

    this.homes.Filters = {
      "location": "United States"
    };


    this.router.navigate(['/ViewAllHomes']);



  }



  CairoHomesNextMonth() {

    this.homes.Filters = {
      "location": "cairo",
      "startDate": this.getNextMonthDates()[0],
       "endDate": this.getNextMonthDates()[length-1]
    };


    this.router.navigate(['/ViewAllHomes']);

  }


  CairoHomes() {

    this.homes.Filters = {
      "location": "cairo"
    };


    this.router.navigate(['/ViewAllHomes']);


  }


  SpainHomes() {

    this.homes.Filters = {
      "location": "Spain"
    };


    this.router.navigate(['/ViewAllHomes']);

  }




  constructor(private homeService: HomeService , private cdr:ChangeDetectorRef , private homes:FilterHomesServices ,private router:Router) { }

  ngOnInit(): void {
    this.homes.Filters = [];
    const next7Days = this.getNext7Days();
    const nextMonthDates = this.getNextMonthDates();
    const FavProperties= this.homeService.GetPopularHomes();

    console.log(next7Days);
    console.log(this.getNext7Days()[0]);


  this.homeService.GetPopularHomes().subscribe({
    next: (response) => {
      this.AllData = response;


      this.homeService.GetFavProp().subscribe({
        next: (fav) => {
          this.AllData.forEach(p => p.IsFav = fav.some(f=>f.propertyId == p.id))
          console.log(response);

        }
      });

       this.FilterPropertiesBySpain = response.filter(x => x?.country?.toLowerCase() == 'spain' && x?.status?.toLowerCase()=='active').slice(0, 8);
      console.log(this.FilterPropertiesBySpain);

      this.FilterPropertiesByCity = this.AllData.filter(p => p.city?.toLowerCase() === 'paris'?.toLowerCase()).filter(x=>x.status=='active').slice(0, 8);


      this.FilterPropertiesInParisByAvailability = response.filter(property => {
      const isInParis = property.city?.toLowerCase() === 'paris';

     if (!isInParis) return false;

     const availableDates = property.availabilityDates?.filter(a => {
     const formattedDate = a.date.split('T')[0];
     return next7Days.includes(formattedDate) && a.isAvailable;
  });

  return availableDates && availableDates.length > 0;
      }).filter(x=>x.status=='active').slice(0, 8);


      this.FilterPropertiesByCairo = response.filter(p => p.city.toLowerCase() == "cairo".toLowerCase()).filter(x=>x.status=='active').slice(0, 8);


      this.FilterPropertiesByUnitedStates = response.filter(p => p.country.toLowerCase() == 'United States'.toLowerCase()).filter(x=>x.status=='active').slice(0, 8);
        //  &&p.reviews.some(r=>r.rating>4));

      this.FilterPropertiesInCairoByAvailability = response.filter(property => {
     const isInParis = property.city?.toLowerCase() == 'cairo'.toLowerCase();

     if (!isInParis) return false;

    const availableDates = property.availabilityDates?.filter(a => {
    const formattedDate = a.date.split('T')[0];
    return nextMonthDates.includes(formattedDate) && a.isAvailable;
  });

    return availableDates && availableDates.length > 0;
      }).filter(x=>x.status=='active').slice(0, 8);


      this.cdr.detectChanges();





    }
  });







}





  }


