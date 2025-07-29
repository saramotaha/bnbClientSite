// app.routes.ts
import { Routes } from '@angular/router';
import { PropertyListComponent } from './components/host/pt1/property-list/property-list';
import { listingsRoutes } from './components/host/pt1/listings/listings.routes';
import { EditPropertyComponent } from './components/host/pt1/edit-property.component/edit-property.component';

export const routes: Routes = [
  { path: '', component: PropertyListComponent },
  { path: 'host', children: listingsRoutes },
  { path: 'edit/:id', component: EditPropertyComponent }

];
