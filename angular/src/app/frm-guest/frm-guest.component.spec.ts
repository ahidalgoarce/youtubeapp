import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrmGuestComponent } from './frm-guest.component';

describe('FrmGuestComponent', () => {
  let component: FrmGuestComponent;
  let fixture: ComponentFixture<FrmGuestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrmGuestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrmGuestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
