import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'averageRating'
})
export class AverageRatingPipe implements PipeTransform {

  transform(reviews: { rating: number }[] = []): number {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return total / reviews.length;
  }

}
