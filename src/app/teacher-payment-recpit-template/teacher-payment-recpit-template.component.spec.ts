import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherPaymentRecpitTemplateComponent } from './teacher-payment-recpit-template.component';

describe('TeacherPaymentRecpitTemplateComponent', () => {
  let component: TeacherPaymentRecpitTemplateComponent;
  let fixture: ComponentFixture<TeacherPaymentRecpitTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeacherPaymentRecpitTemplateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherPaymentRecpitTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
