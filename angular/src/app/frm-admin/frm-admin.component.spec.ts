import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrmAdminComponent } from './frm-admin.component';

describe('FrmAdminComponent', () => {
  let component: FrmAdminComponent;
  let fixture: ComponentFixture<FrmAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrmAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrmAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
