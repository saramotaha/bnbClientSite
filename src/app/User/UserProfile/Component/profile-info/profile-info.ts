import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../Pages/Auth/auth.service';
import { GetTripsOfUser } from '../../Services/get-trips-of-user';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { CommonModule } from '@angular/common';
import { IUserReviews } from '../../Models/iuser-reviews';

@Component({
  selector: 'app-profile-info',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './profile-info.html',
  styleUrl: './profile-info.css'
})
export class ProfileInfo implements OnInit {

  currentUser!: any;
  id: number = 0;
  AllReviews!: IUserReviews[];

  FavValue: any|null;








  favPlace: string = '';


  FavPlacesForm = new FormGroup({
    placeName:new FormControl(''),
  })



AddFavPlace() {
  const place = this.FavPlacesForm.value.placeName; // هات القيمة من الفورم
  console.log(place);

  if (!place) return;

  localStorage.setItem('FavPlace', place);

  this.favPlace = place;
  this.FavValue = place;

  console.log('FavPlace in localStorage:', localStorage.getItem('FavPlace'));
}







  constructor(private service: AuthService , private GetTrips:GetTripsOfUser) { }


  ngOnInit(): void {

    this.currentUser = this.service.currentUser;
    console.log(this.currentUser);

    this.id = this?.currentUser?.id ?? 0;
    console.log(this.id);





    this.GetTrips.getReviewsOfUser(this.id).subscribe({
      next: (response) => {
        console.log(response);
        this.AllReviews = response;

      }
    })


  }

}
