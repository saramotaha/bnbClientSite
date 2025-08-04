import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../Pages/Auth/auth.service';
import { GetTripsOfUser } from '../../Services/get-trips-of-user';
import { IUserProfile } from '../../Models/iuser-profile';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-trips',
  imports: [CommonModule,FormsModule],
  templateUrl: './user-trips.html',
  styleUrl: './user-trips.css'
})
export class UserTrips implements OnInit {
  currentUser!: any;
  AllTrips!: IUserProfile[];

  id: number = 0;
  favPlace: string = '';

  AllReviews!: [];

  constructor(private service: AuthService, private GetTrips: GetTripsOfUser ,private cdr: ChangeDetectorRef) { }






  ngOnInit(): void {

     this.currentUser = this.service.currentUser;
    console.log(this.currentUser);

    this.id = this?.currentUser?.id ?? 0;



    this.GetTrips.GetUserTrips(this.id).subscribe({
      next: (response) => {
        this.AllTrips = response;
        this.cdr.detectChanges(); // Ensure the view updates with the new data
        console.log(this.AllTrips);

      }
    });





  }

}
