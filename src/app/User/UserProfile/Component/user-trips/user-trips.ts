import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../Pages/Auth/auth.service';
import { GetTripsOfUser } from '../../Services/get-trips-of-user';
import { IUserProfile } from '../../Models/iuser-profile';

@Component({
  selector: 'app-user-trips',
  imports: [],
  templateUrl: './user-trips.html',
  styleUrl: './user-trips.css'
})
export class UserTrips implements OnInit {
  currentUser!: any;
  AllTrips!: IUserProfile[];

  id: number = 0;
  favPlace: string = '';

  AllReviews!: [];

  constructor(private service: AuthService, private GetTrips: GetTripsOfUser) { }






  ngOnInit(): void {

    this.currentUser = this.service.currentUser;
    console.log(this.currentUser);

    this.id = this?.currentUser?.value?.id ?? 0;



    this.GetTrips.GetUserTrips(this.id).subscribe({
      next: (response) => {
        this.AllTrips = response;
        console.log(this.AllTrips);

      }
    });





  }

}
