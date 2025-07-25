import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViolationCard } from './violation-card';

describe('ViolationCard', () => {
  let component: ViolationCard;
  let fixture: ComponentFixture<ViolationCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViolationCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViolationCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
