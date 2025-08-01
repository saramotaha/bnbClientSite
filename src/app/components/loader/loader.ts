import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LoaderService } from '../../Core/Services/loader-service';

@Component({
  selector: 'app-loader',
   standalone: true,
  imports: [CommonModule],
  templateUrl: './loader.html',
  styleUrls: ['./loader.css']
})
export class Loader implements OnInit{

  loader: boolean = false;

  constructor(private service: LoaderService, private cdr: ChangeDetectorRef) { }
  ngOnInit(): void {
     this.service.loading$.subscribe({
       next: (response) => {
             console.log('Loader state:', response); // <-- check if it logs true/false


        this.loader = response;
        this.cdr.detectChanges();


      }
    })
  }




  }


