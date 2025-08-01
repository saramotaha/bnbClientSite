import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendationDetails } from './recommendation-details';

describe('RecommendationDetails', () => {
  let component: RecommendationDetails;
  let fixture: ComponentFixture<RecommendationDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecommendationDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecommendationDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
