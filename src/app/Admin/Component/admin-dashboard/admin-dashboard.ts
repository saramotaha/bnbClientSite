import { Component } from '@angular/core';
import { DashBoardBar } from "../dash-board-bar/dash-board-bar";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  imports: [DashBoardBar , RouterOutlet],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard {

}
