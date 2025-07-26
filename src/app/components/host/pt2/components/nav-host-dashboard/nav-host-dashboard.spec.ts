import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavHostDashboard } from './nav-host-dashboard';

describe('NavHostDashboard', () => {
  let component: NavHostDashboard;
  let fixture: ComponentFixture<NavHostDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavHostDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavHostDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
