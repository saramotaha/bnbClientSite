import { AfterViewInit, Component, Input } from '@angular/core';
import * as L from 'leaflet';


@Component({
  selector: 'app-porperty-location',
  imports: [],
  templateUrl: './porperty-location.html',
  styleUrl: './porperty-location.css'
})
export class PorpertyLocation implements AfterViewInit {
  private map: L.Map | undefined;
  

  // Replace with actual coordinates from backend
  @Input() latitude: number = 30.0444;    // Cairo
   @Input() longitude: number = 31.2357;

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [this.latitude, this.longitude],
      zoom: 40,
      scrollWheelZoom: false
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);
    const customIcon = L.icon({
    iconUrl: 'https://pic.onlinewebfonts.com/thumbnails/icons_465747.svg', // path to your pin
    iconSize: [45, 45], // width and height
    iconAnchor: [19, 38], // point of the icon which will correspond to marker's location
    popupAnchor: [0, -38] // point from which the popup should open relative to the iconAnchor
  });
    L.marker([this.latitude, this.longitude], { icon: customIcon })
      .addTo(this.map)
      .bindPopup('you will be here')
      .openPopup();
  }

}
