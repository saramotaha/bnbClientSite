import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-discounts',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './step14.component.html',
  styleUrls: ['./step14.component.css']
})
export class Step14Component {
  discounts = {
    applyNewListingPromotion: true,
    applyLastMinuteDiscount: true,
    applyWeeklyDiscount: true,
    applyMonthlyDiscount: true
  };

  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/host/listings/create/step13']);
  }

  saveDiscounts() {
    console.log(this.discounts);
    this.router.navigate(['/host/listings/create/step15']);
  }
}
