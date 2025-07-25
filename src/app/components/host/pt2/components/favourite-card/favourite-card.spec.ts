import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavouriteCard } from './favourite-card';

describe('FavouriteCard', () => {
  let component: FavouriteCard;
  let fixture: ComponentFixture<FavouriteCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavouriteCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavouriteCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
