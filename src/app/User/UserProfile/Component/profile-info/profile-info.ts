import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../Pages/Auth/auth.service';
import { GetTripsOfUser } from '../../Services/get-trips-of-user';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { CommonModule } from '@angular/common';
import { IUserReviews } from '../../Models/iuser-reviews';
import { UserManagementService } from '../../../../Admin/Services/user-management-service';
import { IuserData } from '../../Models/iuser-data';
import { EditProfile } from '../../Services/edit-profile';
import { IEditProfile } from '../../Models/iedit-profile';

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
  UserData!: IuserData;

  FavValue: any|null;








  favPlace: string = '';


  FavPlacesForm = new FormGroup({
    preferredCity:new FormControl('',Validators.required),
    budgetForNight:new FormControl('',Validators.required),
    MaxGuest:new FormControl('',Validators.required),
    propertyType:new FormControl('',Validators.required),
  })



AddFavPlace() {
  // const place = this.FavPlacesForm.value.placeName; // هات القيمة من الفورم
  // console.log(place);

  // if (!place) return;

   localStorage.setItem('userPreferences', JSON.stringify(this.FavPlacesForm.value));

  // this.favPlace = place;
  // this.FavValue = place;

  // console.log('FavPlace in localStorage:', localStorage.getItem('FavPlace'));
}


  EditProfileForm = new FormGroup({
    dateOfBirth:new FormControl(this.UserData?.dateOfBirth),
   email:new FormControl(this.UserData?.email),
   firstName:new FormControl(this.UserData?.firstName),
   lastName:new FormControl(this.UserData?.lastName),
   phoneNumber:new FormControl(this.UserData?.phoneNumber),
  //  profilePictureUrl:new FormControl(this.UserData?.profilePictureUrl),

  })




  EditProfile() {

    console.log(this.EditProfileForm.value);
    this.edit.UpdateProfile(this.EditProfileForm.value as IEditProfile).subscribe({
      next: (response) => {

        console.log(response);


      }
    })



  }






  constructor(private service: AuthService , private GetTrips:GetTripsOfUser , private userService:UserManagementService , private edit:EditProfile) { }


  ngOnInit(): void {

    this.currentUser = this.service.currentUser;
    console.log(this.currentUser);

    this.id = this?.currentUser?.id ?? 0;
    console.log(this.id);



    this.userService.GetUserData(this.id).subscribe({
      next: (response) => {
        this.UserData = response as IuserData;

        this.EditProfileForm.patchValue({
          dateOfBirth: this.UserData.dateOfBirth
            ? new Date(this.UserData.dateOfBirth).toISOString().split('T')[0]
            : '',
          email: this.UserData.email,
          firstName: this.UserData.firstName,
          lastName: this.UserData.lastName,
          phoneNumber: this.UserData.phoneNumber,
          // profilePictureUrl: this.UserData.profilePictureUrl
        });
      }
    }),





    this.GetTrips.getReviewsOfUser(this.id).subscribe({
      next: (response) => {
        console.log(response);
        this.AllReviews = response;

      }
    })


  }

}
