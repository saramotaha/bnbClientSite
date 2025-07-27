// app.routes.ts
import { Routes } from '@angular/router';
import { PropertyListComponent } from './components/host/pt1/property-list/property-list';
import { listingsRoutes } from './components/host/pt1/listings/listings.routes';

export const routes: Routes = [
  { path: '', component: PropertyListComponent },
  { path: 'host', children: listingsRoutes },
];
