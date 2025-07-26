import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PropertyDetails } from './User/Property-Details/property-details/property-details';
import { Home } from './Pages/home/home';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PropertyDetails,Home],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'bnbClientApp';
}
