import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { GoogleMap, MapMarker } from '@angular/google-maps';
import { CurrentProperties } from '../../Core/Services/current-properties';
import { IPropertyList } from '../../Core/Models/iproperty-list';
import { Subscription } from 'rxjs';

declare const google: any;


@Component({
  selector: 'app-map',
  imports: [CommonModule, GoogleMap, MapMarker],
  templateUrl: './map.html',
  styleUrl: './map.css'
})
export class Map implements OnInit , OnDestroy {

  markers: any[] = [];
  center: any;
  zoom: any;
  private properties!: Subscription;


  constructor(private props:CurrentProperties) {}
  ngOnInit(): void {
    console.log(this.props);

     this.props.getCurrentPageProperties().forEach(property => {
      console.log(`${property.title} at ${property.latitude}, ${property.longitude}`);
     });


    this.properties = this.props.currentProps$.subscribe(property=>{

      if (property.length > 0) {
         this.markers=property.map((prop) => ({
        position: {
          lat: prop.latitude,
          lng: prop.longitude
        },
      title: prop.title,


    }));

      }



       else {
        this.markers = [];
      }



    })

    console.log(this.markers);






    this.center = { lat: this.props.getCurrentPageProperties()[0].latitude, lng: this.props.getCurrentPageProperties()[0].longitude };
    this.zoom = 2



  }



  ngOnDestroy(): void {
    if (this.properties) {
      this.properties.unsubscribe();
    }
  }





}
