import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Nav } from './Shared/nav/nav';
import { HostCalendarPage } from './components/host/pt2/pages/host-calendar-page/host-calendar-page';
import { HostDashboard } from "./components/host/pt2/pages/host-dashboard/host-dashboard";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Nav, HostCalendarPage, HostDashboard],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'bnbClientApp';
}
