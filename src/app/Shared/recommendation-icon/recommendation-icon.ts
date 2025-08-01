import { Component , OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { RecommendationDetails } from '../recommendation-details/recommendation-details';
import { Login } from '../../Pages/login/login';
import { AuthService } from '../../Pages/Auth/auth.service';

@Component({
  selector: 'app-recommendation-icon',
  imports: [],
  templateUrl: './recommendation-icon.html',
  styleUrl: './recommendation-icon.css'
})
export class RecommendationIcon implements OnInit {
  showIcon : boolean=true;
  constructor(private http : HttpClient,
    private router: Router,
    private dialog : MatDialog,
    private authService : AuthService
  ){}
  ngOnInit(){
    this.router.events.subscribe(()=>{
      const currentRouter = this.router.url;
      this.showIcon=![`/login`,'/register'].some(route=>currentRouter.includes(route));
    });
  }
 /* getRecommednations(){
    const userId = this.authService.getUserId();
     this.http.get<any[]>(`http://localhost:7145/api/Recommendations/user/${userId}`).subscribe({
      next
     })
  }*/
}
