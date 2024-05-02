import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageEnrolmentComponent } from './manage-enrolment.component';

describe('ManageEnrolmentComponent', () => {
  let component: ManageEnrolmentComponent;
  let fixture: ComponentFixture<ManageEnrolmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageEnrolmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageEnrolmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
