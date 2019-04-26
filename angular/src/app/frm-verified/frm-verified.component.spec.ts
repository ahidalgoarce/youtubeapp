import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrmVerifiedComponent } from './frm-verified.component';

describe('FrmVerifiedComponent', () => {
  let component: FrmVerifiedComponent;
  let fixture: ComponentFixture<FrmVerifiedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrmVerifiedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrmVerifiedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
