import { TestBed } from '@angular/core/testing';

import { EnrolmentCourseService } from './enrolment-course.service';

describe('EnrolmentCourseService', () => {
  let service: EnrolmentCourseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnrolmentCourseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
