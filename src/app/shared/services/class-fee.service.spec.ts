import { TestBed } from '@angular/core/testing';

import { ClassFeeService } from './class-fee.service';

describe('ClassFeeService', () => {
  let service: ClassFeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClassFeeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
