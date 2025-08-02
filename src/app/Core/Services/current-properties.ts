import { Injectable } from '@angular/core';
import { IPropertyList } from '../Models/iproperty-list';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrentProperties {

   private currentPropsSubject = new BehaviorSubject<IPropertyList[]>([]);
  currentProps$ = this.currentPropsSubject.asObservable();

  setCurrentPageProperties(properties: IPropertyList[]) {
    this.currentPropsSubject.next(properties);
  }

  getCurrentPageProperties(): IPropertyList[] {
    return this.currentPropsSubject.getValue();
  }

}
