import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrmPlaylistComponent } from './frm-playlist.component';

describe('FrmPlaylistComponent', () => {
  let component: FrmPlaylistComponent;
  let fixture: ComponentFixture<FrmPlaylistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrmPlaylistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrmPlaylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
