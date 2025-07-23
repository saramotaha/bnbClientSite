import { RedirectCommand, Routes } from '@angular/router';
import { Home } from './Pages/home/home';
import { Login } from './Pages/login/login';
import { Register } from './Pages/register/register';
import { PropertyDetails } from './User/Property-Details/property-details/property-details';
import { Checkout } from './Pages/checkout/checkout';
import { Messages } from './Pages/messages/messages';
import { Notifications } from './Pages/notifications/notifications';
import { Profile } from './Pages/profile/profile';
import { PropertyPhotos } from './Pages/property-photos/property-photos';
import { Trips } from './Pages/trips/trips';
import { Wishlist } from './Pages/wishlist/wishlist';
import { ProfileInfo } from './Pages/profile-info/profile-info';
import { NotFound } from './Pages/not-found/not-found';

export const routes: Routes = [
  { path: "", redirectTo:"home", pathMatch: "full"},
  { path: "home", component: Home , pathMatch:"full" },
  { path: "login", component: Login , pathMatch:"full" },
  { path: "register", component: Register , pathMatch:"full" },
  { path: "propertyDetails/:id", component: PropertyDetails , pathMatch:"full" },
  { path: "messages", component: Messages , pathMatch:"full" },
  { path: "notifications", component: Notifications , pathMatch:"full" },
  { path: "propertyPhotos", component: PropertyPhotos , pathMatch:"full" },
  { path: "trips", component: Trips , pathMatch:"full" },
  { path: "wishList", component: Wishlist , pathMatch:"full" },
  { path: "profile", component: Profile , pathMatch:"full" },
  { path: "profileInfo", component: ProfileInfo , pathMatch:"full" },
  { path: "checkout", component: Checkout , pathMatch:"full" },
  { path: "**", component: NotFound}
];
