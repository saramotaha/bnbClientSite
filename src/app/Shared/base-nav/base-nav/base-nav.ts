import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Notifications } from '../../../User/notifications/notifications';

@Component({
  selector: 'app-base-nav',
  standalone: true,
  imports: [RouterLink, CommonModule, Notifications],
  templateUrl: './base-nav.html',
  styleUrl: './base-nav.css'
})
export class BaseNav {
  
}