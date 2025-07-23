import { Component } from '@angular/core';
import { PropertyList } from "../../components/property-list/property-list";

@Component({
  selector: 'app-home',
  imports: [PropertyList],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

}
