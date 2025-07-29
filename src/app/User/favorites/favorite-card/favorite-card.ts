import { Component, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Ifavorite } from '../models/ifavorite';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-favorite-card',
  imports:[CommonModule],
  templateUrl: './favorite-card.html',
  styleUrls: ['./favorite-card.css'],
  standalone: true
})
export class FavoriteCard {
  constructor(private cdr:ChangeDetectorRef){}
  @Input() favorite!: Ifavorite;
  @Output() remove = new EventEmitter<void>();
 hover = false;
 onMouseEnter() {
  this.hover = true;
  this.cdr.detectChanges();
}


onMouseLeave() {
  this.hover = false;
  this.cdr.detectChanges();
}

  onRemoveClick() {
    this.remove.emit();
    
  }
  
}