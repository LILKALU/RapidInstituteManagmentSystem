import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageOtherEmployeeComponent } from './manage-other-employee.component';

describe('ManageOtherEmployeeComponent', () => {
  let component: ManageOtherEmployeeComponent;
  let fixture: ComponentFixture<ManageOtherEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageOtherEmployeeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageOtherEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
