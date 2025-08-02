import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendationIcon } from './recommendation-icon';

describe('RecommendationIcon', () => {
  let component: RecommendationIcon;
  let fixture: ComponentFixture<RecommendationIcon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecommendationIcon]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecommendationIcon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
