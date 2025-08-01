import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HostInsightsComponent } from "./components/host/pt1/host-insights.component/host-insights.component";

@Component({
  selector: 'app-root',
  imports: [ RouterOutlet, HostInsightsComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'bnbClientApp';
}
