import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodayBookingsComponent } from './today-bookings';

describe('TodayBookingsComponent', () => {
  let component: TodayBookingsComponent;
  let fixture: ComponentFixture<TodayBookingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodayBookingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodayBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
