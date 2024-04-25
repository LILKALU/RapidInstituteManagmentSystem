import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageHallComponent } from './manage-hall.component';

describe('ManageHallComponent', () => {
  let component: ManageHallComponent;
  let fixture: ComponentFixture<ManageHallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageHallComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageHallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
