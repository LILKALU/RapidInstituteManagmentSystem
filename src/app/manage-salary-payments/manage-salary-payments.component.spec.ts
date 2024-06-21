import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSalaryPaymentsComponent } from './manage-salary-payments.component';

describe('ManageSalaryPaymentsComponent', () => {
  let component: ManageSalaryPaymentsComponent;
  let fixture: ComponentFixture<ManageSalaryPaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageSalaryPaymentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageSalaryPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
