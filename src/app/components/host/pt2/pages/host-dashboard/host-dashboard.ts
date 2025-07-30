import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavHostDashboard } from "../../components/nav-host-dashboard/nav-host-dashboard";
import { Footer } from "../../../../../Shared/footer/footer";

@Component({
  selector: 'app-host-dashboard',
  standalone: true,
  imports: [RouterOutlet, NavHostDashboard, Footer],
  templateUrl: './host-dashboard.html',
  styleUrl: './host-dashboard.css'
})
export class HostDashboard {

}
