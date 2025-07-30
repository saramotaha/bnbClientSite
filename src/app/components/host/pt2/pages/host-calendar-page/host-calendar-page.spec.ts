import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostCalendarPage } from './host-calendar-page';

describe('HostCalendarPage', () => {
  let component: HostCalendarPage;
  let fixture: ComponentFixture<HostCalendarPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostCalendarPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostCalendarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
