import { TestBed } from '@angular/core/testing';

import { TeacherPaymentCourseService } from './teacher-payment-course.service';

describe('TeacherPaymentCourseService', () => {
  let service: TeacherPaymentCourseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeacherPaymentCourseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
