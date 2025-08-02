import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { LoaderService } from '../../Core/Services/loader-service';

@Component({
  selector: 'app-loader',
  imports: [CommonModule],
  templateUrl: './loader.html',
  styleUrl: './loader.css'
})
export class Loader {

  loader: boolean = false;

  constructor(private service: LoaderService , private cdr:ChangeDetectorRef) {

    service.loading$.subscribe({
      next: (response) => {

        this.loader = response;
        cdr.detectChanges();


      }
    })


  }

}
