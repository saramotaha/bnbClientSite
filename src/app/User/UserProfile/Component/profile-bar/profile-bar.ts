import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../Pages/Auth/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile-bar',
  imports: [RouterLink],
  templateUrl: './profile-bar.html',
  styleUrl: './profile-bar.css'
})
export class ProfileBar implements OnInit {

  currentUser!: any;
  constructor(private service: AuthService) { }

  ngOnInit(): void {

     this.currentUser = this.service.currentUser;
    // console.log(this.currentUser);

  }





    // this.GetTrips.GetUserTrips(this.currentUser.id).subscribe({
    //   next: (response) => {
    //     this.AllTrips = response;
    //     console.log(this.AllTrips);

    //   }
    // });

}
