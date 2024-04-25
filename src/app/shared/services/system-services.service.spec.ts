import { TestBed } from '@angular/core/testing';

import { SystemServicesService } from './system-services.service';

describe('SystemServicesService', () => {
  let service: SystemServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SystemServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
