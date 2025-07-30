import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../Pages/Auth/auth.service';

@Component({
  selector: 'app-user-profile',
  imports: [],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css'
})

export class UserProfile implements OnInit {
  currentUser!: any;

  constructor(private service: AuthService) { }


  ngOnInit(): void {

    this.currentUser = this.service.getUserProfile;
    console.log( this.service.currentUser);
  }

}
