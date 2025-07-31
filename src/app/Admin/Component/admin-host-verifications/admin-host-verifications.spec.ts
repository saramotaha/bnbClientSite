import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostVirefications } from './host-virefications';

describe('HostVirefications', () => {
  let component: HostVirefications;
  let fixture: ComponentFixture<HostVirefications>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostVirefications]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostVirefications);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
