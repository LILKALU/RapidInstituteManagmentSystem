import { TestBed } from '@angular/core/testing';

import { PrivilageService } from './privilage.service';

describe('PrivilageService', () => {
  let service: PrivilageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrivilageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
