import { Component } from '@angular/core';
import { PropertyDetails } from './User/Property-Details/property-details/property-details';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { Home } from './Pages/home/home';
import { GoogleMapsModule } from '@angular/google-maps';
import { Footer } from "./Shared/footer/footer";
import { Nav } from "./Shared/nav/nav";
import { HostDashboard } from './components/host/pt2/pages/host-dashboard/host-dashboard';
import { Login } from './Pages/login/login';
import { Notifications } from "./User/notifications/notifications";
import { BaseNav } from "./Shared/base-nav/base-nav/base-nav";
import { RecommendationIcon } from "./Shared/recommendation-icon/recommendation-icon";
import { Loader } from "./components/loader/loader";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GoogleMapsModule, HostDashboard, Notifications, Loader, Nav, BaseNav, RecommendationIcon],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'bnbClientApp';
}
