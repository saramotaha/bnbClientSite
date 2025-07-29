import { Component } from '@angular/core';


import { PropertyDetails } from './User/Property-Details/property-details/property-details';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { Home } from './Pages/home/home';
import { GoogleMapsModule } from '@angular/google-maps';


@Component({
  selector: 'app-root',

  imports: [RouterOutlet, PropertyDetails,Home,MatDialogModule,GoogleMapsModule],

  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'bnbClientApp';
}
