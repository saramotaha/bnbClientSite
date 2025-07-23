import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HomeService } from '../../Core/Services/home-service';
import { IPropertyList } from '../../Core/Models/iproperty-list';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-property-list',
  imports: [CommonModule],
  templateUrl: './property-list.html',
  styleUrls: ['./property-list.css']
})
export class PropertyList implements OnInit {

  FilterPropertiesByCity: IPropertyList[] = [];
  FilterPropertiesInParisByAvailability: IPropertyList[] = [];
  FilterPropertiesInCairoByAvailability: IPropertyList[] = [];
  FilterPropertiesByCairo: IPropertyList[] = [];
  FilterPropertiesBySpain: IPropertyList[] = [];
  AllData: IPropertyList[] = [];

  getNext7Days(): string[] {
  const dates: string[] = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + i);
    const formatted = nextDate.toISOString().split('T')[0];
    dates.push(formatted);
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



  constructor(private homeService: HomeService , private cdr:ChangeDetectorRef) { }

  ngOnInit(): void {
    const next7Days = this.getNext7Days();
    const nextMonthDates = this.getNextMonthDates();
    const FavProperties= this.homeService.GetPopularHomes();


  this.homeService.GetPopularHomes().subscribe({
    next: (response) => {
      this.AllData = response;
      // console.log(response);

      this.homeService.GetFavProp().subscribe({
        next: (fav) => {
          this.AllData.forEach(p => p.IsFav = fav.some(f=>f.propertyId == p.id))
          console.log(response);

        }
      });

       this.FilterPropertiesBySpain = response.filter(x => x?.country?.toLowerCase() == 'spain');
      console.log(this.FilterPropertiesBySpain);



      this.FilterPropertiesByCity = this.AllData
        .filter(p => p.city.toLowerCase() === 'paris'.toLowerCase())
        .slice(0, 10);



      this.FilterPropertiesInParisByAvailability = response.filter(property => {
      const isInParis = property.city?.toLowerCase() === 'paris';

     if (!isInParis) return false;

     const availableDates = property.availabilityDates?.filter(a => {
     const formattedDate = a.date.split('T')[0];
     return next7Days.includes(formattedDate) && a.isAvailable;
  });

  return availableDates && availableDates.length > 0;
}).slice(0, 10);




      this.FilterPropertiesByCairo = response.filter(p => p.city.toLowerCase() == "cairo".toLowerCase()).slice(0, 10);

      this.FilterPropertiesInCairoByAvailability = response.filter(property => {
     const isInParis = property.city?.toLowerCase() == 'cairo'.toLowerCase();

     if (!isInParis) return false;

    const availableDates = property.availabilityDates?.filter(a => {
    const formattedDate = a.date.split('T')[0];
    return nextMonthDates.includes(formattedDate) && a.isAvailable;
  });

    return availableDates && availableDates.length > 0;
     }).slice(0, 10);
      this.cdr.detectChanges();





    }
  });







}



}
