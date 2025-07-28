import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Home } from "./Pages/home/home";
import { GoogleMapsModule } from '@angular/google-maps';
import { Footer } from "./Shared/footer/footer";
import { Nav } from "./Shared/nav/nav";
import { Login } from './Pages/login/login';
import { HostDashboard } from './components/host/pt2/pages/host-dashboard/host-dashboard';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GoogleMapsModule, HostDashboard, Login],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'bnbClientApp';
}
