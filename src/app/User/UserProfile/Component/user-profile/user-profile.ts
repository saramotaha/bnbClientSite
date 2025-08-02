import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../Pages/Auth/auth.service';
import { GetTripsOfUser } from '../../Services/get-trips-of-user';
import { IUserProfile } from '../../Models/iuser-profile';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileBar } from "../profile-bar/profile-bar";
import { ProfileInfo } from "../profile-info/profile-info";
import { RouterOutlet } from '@angular/router';
import { IUserReviews } from '../../Models/iuser-reviews';

@Component({
  selector: 'app-user-profile',
  imports: [ReactiveFormsModule, ProfileBar, RouterOutlet],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css'
})

export class UserProfile implements OnInit {
  currentUser!: any;
  AllTrips!: IUserProfile[];

  id: number = 0;
  favPlace: string = '';

  AllReviews!: IUserReviews[];

  constructor(private service: AuthService, private GetTrips: GetTripsOfUser) { }


  FavPlacesForm = new FormGroup({
    placeName:new FormControl(''),
  })



  AddFavPlace() {


    console.log(this.FavPlacesForm.value.placeName);
    console.log(localStorage.getItem('FavPlace'));


    if (localStorage.getItem('FavPlace') == null) {


       this.favPlace = this?.FavPlacesForm?.value?.placeName??'';
      localStorage.setItem('FavPlace', this.favPlace);

    }

    else {

      localStorage.removeItem('FavPlace');
       localStorage.setItem('FavPlace', this.favPlace);
    }




  }

  ngOnInit(): void {

    this.currentUser = this.service.currentUser;
    console.log(this.currentUser);

    this.id = this?.currentUser?.id ?? 0;



    this.GetTrips.GetUserTrips(this.id).subscribe({
      next: (response) => {
        this.AllTrips = response;
        console.log(this.AllTrips);

      }
    });


    this.GetTrips.getReviewsOfUser(this.id).subscribe({
      next: (response) => {
        console.log(response);
        this.AllReviews = response;

      }
    })


  }

}
