import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit , AfterViewInit  } from '@angular/core';
import { GoogleMap, MapMarker } from '@angular/google-maps';
import { CurrentProperties } from '../../Core/Services/current-properties';
import { IPropertyList } from '../../Core/Models/iproperty-list';
import { map, Subscription } from 'rxjs';

// declare const google: any;
import * as L from 'leaflet';



@Component({
  selector: 'app-map',
  imports: [CommonModule],
  templateUrl: './map.html',
  styleUrl: './map.css'
})

export class Map implements AfterViewInit, OnInit {
  private properties!: Subscription;
  private map!: L.Map;
  markers: any[] = [];
  customIcon!: L.Icon;



  constructor(private props: CurrentProperties) { }
  ngOnInit(): void {

    this.customIcon = L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // Change to your icon
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -35]
    });





    this.properties = this.props.currentProps$.subscribe(property => {
      if (property.length > 0) {
        this.markers = property.map((prop) => ({
          lat: prop.latitude,
          lng: prop.longitude,
          title: prop.title
        }));

        // ✅ Add markers if map is initialized
        if (this.map) {
          this.addMarkers();
        }
      } else {
        this.markers = [];
      }
    });
  }


ngAfterViewInit(): void {
    // ✅ Initialize map
    this.map = L.map('map');

    // ✅ Dark map style
    L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.map.invalidateSize();

    // ✅ Add markers if already loaded
    if (this.markers.length > 0) {
      this.addMarkers();
    }
  }

  addMarkers(): void {
    // ✅ Remove old markers only
    this.map.eachLayer((layer: any) => {
      if (layer instanceof L.Marker) this.map.removeLayer(layer);
    });

    // ✅ Add new markers
    this.markers.forEach(marker => {
      L.marker([marker.lat, marker.lng], { icon: this.customIcon })
        .addTo(this.map)
        .bindPopup(marker.title);
    });

    // ✅ Auto zoom to fit all markers
    if (this.markers.length > 0) {
      const bounds = L.latLngBounds(this.markers.map(m => [m.lat, m.lng]));
     this.map.fitBounds(bounds, { padding: [-150, -150], maxZoom: 50 });
        // this.map.setZoom(16); // Override fitBounds zoom

    }
  }

  ngOnDestroy(): void {
    if (this.properties) {
      this.properties.unsubscribe();
    }
  }

}
