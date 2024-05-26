import { TestBed } from '@angular/core/testing';

import { ClassFeeCourseService } from './class-fee-course.service';

describe('ClassFeeCourseService', () => {
  let service: ClassFeeCourseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClassFeeCourseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
