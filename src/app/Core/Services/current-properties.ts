import { Injectable } from '@angular/core';
import { IPropertyList } from '../Models/iproperty-list';

@Injectable({
  providedIn: 'root'
})
export class CurrentProperties {

  currentPageProperties: IPropertyList[] = [];

  setCurrentPageProperties(properties: IPropertyList[]) {
    this.currentPageProperties = properties;
  }

  getCurrentPageProperties(): IPropertyList[] {
    return this.currentPageProperties;
  }

}
