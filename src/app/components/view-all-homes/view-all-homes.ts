import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FilterHomesServices } from '../../Core/Services/filter-homes-services';
import { IPropertyList } from '../../Core/Models/iproperty-list';
import { CommonModule } from '@angular/common';
import { Map } from "../map/map";

import { CurrentProperties } from '../../Core/Services/current-properties';
import { Nav } from "../../Shared/nav/nav";
import { Footer } from "../../Shared/footer/footer";
import { Loader } from "../loader/loader";
import { FormsModule } from '@angular/forms';
import { NotFound } from '../../Pages/not-found/not-found';
import { Route, Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-view-all-homes',
  standalone: true,
  imports: [CommonModule, Map, FormsModule, Nav, Footer, NotFound, Loader,RouterLink],
  templateUrl: './view-all-homes.html',
  styleUrl: './view-all-homes.css'
})
export class ViewAllHomes implements OnInit {



  // pagination properties

AllFilters!: {};
AllFilteredHomes: IPropertyList[] = [];
pagedProperties: IPropertyList[] = [];
itemsPerPage:number = 9;
currentPage = 1;
get totalPages(): number {
  return Math.ceil(this.AllFilteredHomes.length / this.itemsPerPage);
  }

  constructor(private service: FilterHomesServices , private cdr:ChangeDetectorRef , private CurrentProps :CurrentProperties,private router:Router) { }




 paginatedHomes():void {
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  const EndIndex = startIndex + this.itemsPerPage;
   this.pagedProperties = this.AllFilteredHomes.slice(startIndex, EndIndex);
   this.CurrentProps.setCurrentPageProperties(this.pagedProperties);

}

    nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginatedHomes();
    }
  }


   prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginatedHomes();
    }
  }


  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.paginatedHomes();
    }
  }









  ngOnInit(): void {
     this.service.filters$.subscribe(filters => {
     if (Object.keys(filters).length > 0) {
      this.AllFilters = filters;

    this.service.GetHomes(this.AllFilters).subscribe({
      next: (response) => {
        this.AllFilteredHomes = response;
        this.paginatedHomes();
        this.cdr.detectChanges();
        console.log(response);

      }

    })
      }
     });



  }

/* getPropertyId(id: number): void {
    this.router.navigate(['/propertyDetails', id]);

} */
}
