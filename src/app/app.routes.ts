import { AdminPropertyResponseDto, AdminPropertyListDto } from './Admin/Models/Property.model';
import { Component } from '@angular/core';
import { RedirectCommand, Routes } from '@angular/router';
import { Home } from './Pages/home/home';
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

// import { Checkout } from './Pages/checkout/checkout';
// import { Messages } from './User/messages/messages';
// import { Notifications } from './Pages/notifications/notifications';
// import { Profile } from './Pages/profile/profile';
// import { PropertyPhotos } from './Pages/property-photos/property-photos';
// import { Trips } from './Pages/trips/trips';
// import { Wishlist } from './Pages/wishlist/wishlist';
// import { ProfileInfo } from './Pages/profile-info/profile-info';
import { NotFound } from './Pages/not-found/not-found';
import { Favorites } from './User/favorites/favorites';

import { AdminNotifications } from './Admin/Component/admin-notifications/admin-notifications';
import { Violation } from './Admin/Component/violation/violation';
import { DashBoardBar } from './Admin/Component/dash-board-bar/dash-board-bar';
import { AdminDashboard } from './Admin/Component/admin-dashboard/admin-dashboard';
import { UserManagement } from './Admin/Component/user-management/user-management';
import { DashboardCharts } from './Admin/Component/dashboard-charts/dashboard-charts';

import { AdminHostVerificationComponent } from './Admin/Component/admin-host-verifications/admin-host-verifications';

import { Earnings } from './components/host/pt2/components/earnings/earnings';
import { PropertyListComponent } from './components/host/pt1/property-list/property-list';
import { listingsRoutes } from './components/host/pt1/listings/listings.routes';
import { EditPropertyComponent } from './components/host/pt1/edit-property.component/edit-property.component';
import { ListingStep1Component } from './components/host/pt1/listings/listing-step1/listing-step1.component';
// import { Messages } from './components/host/pt2/components/messages/messages';
import { Login } from './Pages/login/login';
import { AdminPayment } from './Admin/Component/admin-payment/admin-payment';
import { Messages } from './User/messages/messages';
import { UserProfile } from './User/UserProfile/Component/user-profile/user-profile';
import { ViewAllHomes } from './components/view-all-homes/view-all-homes';
import { HostInsightsComponent } from './components/host/pt1/host-insights.component/host-insights.component';
export const routes: Routes = [
  { path: "", redirectTo:"Home", pathMatch: "full"},
  { path: "Home", component: Home, pathMatch: "full" },

  {

    path: "admin",
    component: AdminDashboard,
    children: [
      { path: "", redirectTo: "DashboardCharts", pathMatch: "full" },
      { path: "AdminNotifications", component: AdminNotifications },
      { path: "Violation", component: Violation },
      { path: "UserManagement", component: UserManagement },
      { path: "DashboardCharts", component: DashboardCharts },
      // {path: "PropertyManagement", component: PropertyManagementComponent},

      {path: "AdminHostVerificationComponent", component: AdminHostVerificationComponent},

      {path: "AdminPayment", component: AdminPayment},

    ]

  },
  { path: "login", component: Login },
  { path: "ViewAllHomes", component: ViewAllHomes , pathMatch:"full" },
  { path: "register", component: Register , pathMatch:"full" },
  { path: "propertyDetails/:id", component: PropertyDetails , pathMatch:"full" },

  { path: "messages", component: Messages , pathMatch:"full" },
  // { path: "notifications", component: Notifications , pathMatch:"full" },
  // // { path: "AdminNotifications", component: DashBoardBar , pathMatch:"full" },
  // { path: "propertyPhotos", component: PropertyPhotos , pathMatch:"full" },
  // { path: "trips", component: Trips , pathMatch:"full" },
  // { path: "wishList", component: Wishlist , pathMatch:"full" },
  // { path: "profile", component: Profile , pathMatch:"full" },
  // { path: "profileInfo", component: ProfileInfo , pathMatch:"full" },
  // { path: "checkout", component: Checkout , pathMatch:"full" },
  {
  path: 'host/dashboard',
  component: HostDashboard,
  children: [
    { path: 'calendar', component: HostCalendarPage },
    { path: 'today', component: TodayBookingsComponent },
    { path: 'reservations', component: Reservations },
    { path: 'violations', component: Violations },
    { path: 'earnings', component: Earnings },
    { path: 'listings', component: PropertyListComponent },
    { path: 'create-listing', component: ListingStep1Component },
    { path: 'insights', component: HostInsightsComponent },
    { path: '', redirectTo: 'today', pathMatch: 'full' } // Optional default child route
  ]
},

  // { path: 'host/dashboard/messages', component: Messages},
  // { path: "**", component: NotFound} //MUST BE AT THE END
  { path: '', component: PropertyListComponent },
  { path: 'host', children: listingsRoutes },

  { path: 'edit/:id', component: EditPropertyComponent },



    // { path: "messages", component: Messages , pathMatch:"full" },
  { path: "favorites",component:Favorites,pathMatch:"full"},
  { path: "UserProfile",component:UserProfile,pathMatch:"full"},
  // { path: "notifications", component: Notifications , pathMatch:"full" },
  // { path: "AdminNotifications", component: DashBoardBar , pathMatch:"full" },

  // { path: "propertyPhotos", component: PropertyPhotos , pathMatch:"full" },
  // { path: "trips", component: Trips , pathMatch:"full" },
  // { path: "wishList", component: Wishlist , pathMatch:"full" },
  // { path: "profile", component: Profile , pathMatch:"full" },
  // { path: "profileInfo", component: ProfileInfo , pathMatch:"full" },
  // { path: "checkout", component: Checkout , pathMatch:"full" },
  { path: "**", component: NotFound}

];
