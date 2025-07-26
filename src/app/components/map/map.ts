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
  center: any;
  zoom: any;


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


    this.center = { lat: this.props.getCurrentPageProperties()[0].latitude, lng: this.props.getCurrentPageProperties()[0].longitude };
    this.zoom = 12



  }





}
