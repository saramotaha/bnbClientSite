import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PropertyDetails } from './User/Property-Details/property-details/property-details';
import { Home } from './Pages/home/home';
import { HostDashboard } from './components/host/pt2/pages/host-dashboard/host-dashboard';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PropertyDetails,Home, HostDashboard],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'bnbClientApp';
}
