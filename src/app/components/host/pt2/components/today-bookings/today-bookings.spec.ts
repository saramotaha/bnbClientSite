import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodayBookings } from './today-bookings';

describe('TodayBookings', () => {
  let component: TodayBookings;
  let fixture: ComponentFixture<TodayBookings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodayBookings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodayBookings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
