import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { LoaderService } from '../../Core/Services/loader-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-loader',
  imports: [CommonModule],
  templateUrl: './loader.html',
  styleUrl: './loader.css'
})
export class Loader implements OnInit, OnDestroy {
  loader: boolean = false;
  private subscription: Subscription = new Subscription();

  constructor(private service: LoaderService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    console.log('🎯 Loader component initialized, subscribing to loader service...');
    this.subscription = this.service.loading$.subscribe({
      next: (response) => {
        console.log('🔄 Loader state changed:', response);
        this.loader = response;
        this.cdr.detectChanges();
      }
    });
  }

  ngOnDestroy() {
    console.log('🗑️ Loader component destroyed, unsubscribing...');
    this.subscription.unsubscribe();
  }
}
