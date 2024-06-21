import { TestBed } from '@angular/core/testing';

import { TeacherPaymentService } from './teacher-payment.service';

describe('TeacherPaymentService', () => {
  let service: TeacherPaymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeacherPaymentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
