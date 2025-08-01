import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { IReviews } from '../../../Reviews/Model/ireviews';
import { ReviewService } from '../../../Reviews/review-service';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-property-detials-review',
  imports: [DatePipe,CommonModule],
  templateUrl: './property-detials-review.html',
  styleUrl: './property-detials-review.css'
})
export class PropertyDetialsReview implements OnInit {

    @Input() propertyId!: number;

  guestReviews: IReviews[] = [];
  averageRating: number = 0;
  focusedReviewIndex: number | null = null;

constructor(private reviewService :ReviewService , private cdr :ChangeDetectorRef) {

 }
  ngOnInit(): void {
    this.reviewService.getReviewsForProperty(this.propertyId).subscribe({
      next: (reviews) => {
        console.log('Reviews fetched successfully:', reviews);
        this.guestReviews = reviews;
        this.calculateAverageRating();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching reviews:', error);
      }
    });
  }

calculateAverageRating(): void {
  if (!this.guestReviews || this.guestReviews.length === 0) {
    this.averageRating = 0;
    return;
  }

  const total = this.guestReviews.reduce((sum, review) => sum + review.rating, 0);
  const average = total / this.guestReviews.length;

  this.averageRating = parseFloat(average.toFixed(2)); // rounded to 2 decimal places like 4.95
}
getStarArray(rating: number): number[] {
  return [1, 2, 3, 4, 5];
}


openModalAndScrollTo(index: number): void {
  this.focusedReviewIndex = index;

  // Wait for modal to open before scrolling
  setTimeout(() => {
    const element = document.getElementById('review-' + index);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, 500); // Delay enough for modal to open (bootstrap anim = ~300ms)
}

}
