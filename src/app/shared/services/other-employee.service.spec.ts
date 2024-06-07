import { TestBed } from '@angular/core/testing';

import { OtherEmployeeService } from './other-employee.service';

describe('OtherEmployeeService', () => {
  let service: OtherEmployeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OtherEmployeeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
