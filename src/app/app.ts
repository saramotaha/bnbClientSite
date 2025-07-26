import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Home } from "./Pages/home/home";
import { GoogleMapsModule } from '@angular/google-maps';
import { Footer } from "./Shared/footer/footer";


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, GoogleMapsModule, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'bnbClientApp';
}
