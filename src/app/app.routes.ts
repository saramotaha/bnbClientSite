import { RedirectCommand, Routes } from '@angular/router';
import { Home } from './Pages/home/home';
import { Login } from './Pages/login/login';
import { Register } from './Pages/register/register';
import { PropertyDetails } from './User/Property-Details/property-details/property-details';
// import { Checkout } from './Pages/checkout/checkout';
// import { Messages } from './Pages/messages/messages';
// import { Notifications } from './Pages/notifications/notifications';
// import { Profile } from './Pages/profile/profile';
// import { PropertyPhotos } from './Pages/property-photos/property-photos';
// import { Trips } from './Pages/trips/trips';
// import { Wishlist } from './Pages/wishlist/wishlist';
// import { ProfileInfo } from './Pages/profile-info/profile-info';
// import { NotFound } from './Pages/not-found/not-found';
import { HostCalendarPage } from './components/host/pt2/pages/host-calendar-page/host-calendar-page';
import { HostDashboard } from './components/host/pt2/pages/host-dashboard/host-dashboard';
import { TodayBookingsComponent } from './components/host/pt2/components/today-bookings/today-bookings';
import { Reservations } from './components/host/pt2/components/reservations/reservations';
import { Violations } from './components/host/pt2/components/violations/violations';
import { AdminNotifications } from './Admin/Component/admin-notifications/admin-notifications';
import { Violation } from './Admin/Component/violation/violation';
import { DashBoardBar } from './Admin/Component/dash-board-bar/dash-board-bar';
import { AdminDashboard } from './Admin/Component/admin-dashboard/admin-dashboard';
import { UserManagement } from './Admin/Component/user-management/user-management';
import { DashboardCharts } from './Admin/Component/dashboard-charts/dashboard-charts';
import { Earnings } from './components/host/pt2/components/earnings/earnings';
import { PropertyListComponent } from './components/host/pt1/property-list/property-list';
import { listingsRoutes } from './components/host/pt1/listings/listings.routes';
import { ListingStep1Component } from './components/host/pt1/listings/listing-step1/listing-step1.component';
import { Messages

 } from './components/host/pt2/components/messages/messages';
export const routes: Routes = [
  //{ path: "", redirectTo:"admin", pathMatch: "full"},
  { path: "", component: Home, pathMatch: "full" },


  {

    path: "admin",
    component: AdminDashboard,
    children: [
      { path: "", redirectTo: "DashboardCharts", pathMatch: "full" },
      { path: "AdminNotifications", component: AdminNotifications },
      { path: "Violation", component: Violation },
      { path: "UserManagement", component: UserManagement },
      { path: "DashboardCharts", component: DashboardCharts }
    ]
  },
//  { path: "", redirectTo: "AdminNotifications"  , pathMatch:"full"},
//  { path: "AdminNotifications", component: AdminNotifications , pathMatch:"full"},
//  { path: "Violation", component: Violation , pathMatch:"full" },
//  { path: "UserManagement", component: UserManagement , pathMatch:"full" },
//  { path: "DashboardCharts", component: DashboardCharts , pathMatch:"full" },
  { path: "login", component: Login , pathMatch:"full" },
  { path: "register", component: Register , pathMatch:"full" },
  { path: "propertyDetails/:id", component: PropertyDetails , pathMatch:"full" },
  // { path: "messages", component: Messages , pathMatch:"full" },
  // { path: "notifications", component: Notifications , pathMatch:"full" },
  // // { path: "AdminNotifications", component: DashBoardBar , pathMatch:"full" },
  // { path: "propertyPhotos", component: PropertyPhotos , pathMatch:"full" },
  // { path: "trips", component: Trips , pathMatch:"full" },
  // { path: "wishList", component: Wishlist , pathMatch:"full" },
  // { path: "profile", component: Profile , pathMatch:"full" },
  // { path: "profileInfo", component: ProfileInfo , pathMatch:"full" },
  // { path: "checkout", component: Checkout , pathMatch:"full" },
  { path: 'host/calendar',component: HostCalendarPage },
  { path: 'host', component: HostDashboard }, //layout shell
  { path: 'host/today', component: TodayBookingsComponent},
  { path: 'host/reservations', component: Reservations},
  { path: 'host/violations', component: Violations},
  { path: 'host/earnings', component: Earnings},
  { path: 'host/listings', component: PropertyListComponent},
  { path: 'host/create-listing', component: ListingStep1Component},
  { path: 'host/messages', component: Messages},
  // { path: "**", component: NotFound} //MUST BE AT THE END
  { path: '', component: PropertyListComponent },
  { path: 'host', children: listingsRoutes },
];
