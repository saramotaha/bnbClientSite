import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { GoogleMap, MapMarker } from '@angular/google-maps';
import { CurrentProperties } from '../../Core/Services/current-properties';

declare const google: any;


@Component({
  selector: 'app-map',
  imports: [CommonModule, GoogleMap, MapMarker],
  templateUrl: './map.html',
  styleUrl: './map.css'
})
export class Map implements OnInit {

  markers: any[] = [];


  constructor(private props:CurrentProperties) {}
  ngOnInit(): void {
    console.log(this.props);

     this.props.getCurrentPageProperties().forEach(property => {
      console.log(`${property.title} at ${property.latitude}, ${property.longitude}`);
     });


    this.markers=this.props.getCurrentPageProperties().map((property) => ({
        position: {
          lat: property.latitude,
          lng: property.longitude
        },
        title: property.title,
      }));



  //     markers = [
  //   {
  //     position: { lat: 30.0131, lng: 31.2089 },
  //     title: 'Apartment in Giza',
  //     price: '3,419 ج.م'
  //   },
  //   {
  //     position: { lat: 30.0254, lng: 31.4913 },
  //     title: 'Apartment in New Cairo',
  //     price: '3,499 ج.م'
  //   },
  //   {
  //     position: { lat: 29.9602, lng: 31.2569 },
  //     title: 'Apartment in Maadi',
  //     price: '4,368 ج.م'
  //   },
  //   {
  //     position: { lat: 29.9792, lng: 31.1342 },
  //     title: 'Near Pyramids',
  //     price: '5,014 ج.م'
  //   },
  //   {
  //     position: { lat: 30.0626, lng: 31.2197 },
  //     title: 'Zamalek Apartment',
  //     price: '3,761 ج.م'
  //   }
  // ];


  }

  // Map center (Cairo)
  // center = { lat: 30.0444, lng: 31.2357 };
  zoom = 12;





  // Your locations/markers



  mapOptions: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
   styles: [
  { elementType: 'geometry', stylers: [{ color: '#000000' }] }, // أسود
  { elementType: 'labels.text.fill', stylers: [{ color: '#ff0000' }] }, // أحمر
  { elementType: 'labels.text.stroke', stylers: [{ color: '#00ff00' }] } // أخضر
],
    disableDefaultUI: true
  };

  // When user clicks on marker
  // onMarkerClick(marker: any) {
  //   alert('You clicked: ' + marker.title + ' - ' + marker.price);
  // }

}
