import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Irecomme } from './models/irecomm';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RecommendationService } from './services/recommendation.service';

@Component({
  selector: 'app-recommendation',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './recommendation.html',
  styleUrl: './recommendation.css'
})
export class Recommendation {
  recommendations: Irecomme[]=[];

  constructor(
    private recommService: RecommendationService,
    private snackBar: MatSnackBar
  ){}
  ngOnInit():void{
    const userId=1;
    this.recommService.getRecommendations(userId).subscribe({
      next:(data)=>{
        console.log('Recommendation Loaded',data);
        this.recommendations=data;
      },
      error:(err)=>{
        console.error('failed to load',err)
      }
    })
  }
}
