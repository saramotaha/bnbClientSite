import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { Favorites } from "./User/favorites/favorites";
import { FavoriteCard } from "./User/favorites/favorite-card/favorite-card";
import { MessageList } from "./User/messages/sidebar/message-list";

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MatDialogModule,
     RouterOutlet,
      Favorites,
       FavoriteCard,
        MessageList],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'bnbClientApp';
}
