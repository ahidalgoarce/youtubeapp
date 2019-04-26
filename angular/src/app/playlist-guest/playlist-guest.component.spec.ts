import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistGuestComponent } from './playlist-guest.component';

describe('PlaylistGuestComponent', () => {
  let component: PlaylistGuestComponent;
  let fixture: ComponentFixture<PlaylistGuestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaylistGuestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaylistGuestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
