import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    loading$ = this.isLoading.asObservable();

  show() {
      console.log('[LoaderService] Show called');

    this.isLoading.next(true);
  }
  hide() {
      console.log('[LoaderService] hide called');

    this.isLoading.next(false);
  }


}
