import { Component } from '@angular/core';
import { PropertyList } from "../../components/property-list/property-list";
import { Violation } from "../../Admin/Component/violation/violation";
import { AdminNotifications } from "../../Admin/Component/admin-notifications/admin-notifications";
import { DashBoardBar } from "../../Admin/Component/dash-board-bar/dash-board-bar";
import { AdminDashboard } from "../../Admin/Component/admin-dashboard/admin-dashboard";
import { Nav } from "../../Shared/nav/nav";
import { Footer } from "../../Shared/footer/footer";
import { Loader } from "../../components/loader/loader";

@Component({
  selector: 'app-home',
  imports: [PropertyList, Nav, Footer, Loader],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

}
