import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Notifications } from '../../../User/notifications/notifications';

@Component({
  selector: 'app-base-nav',
  standalone: true,
  imports: [CommonModule, Notifications],
  templateUrl: './base-nav.html',
  styleUrl: './base-nav.css'
})
export class BaseNav {
  
}