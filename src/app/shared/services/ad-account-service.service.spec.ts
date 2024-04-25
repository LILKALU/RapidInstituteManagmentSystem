import { TestBed } from '@angular/core/testing';

import { AdAccountServiceService } from './ad-account-service.service';

describe('AdAccountServiceService', () => {
  let service: AdAccountServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdAccountServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
