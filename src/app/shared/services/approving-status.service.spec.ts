import { TestBed } from '@angular/core/testing';

import { ApprovingStatusService } from './approving-status.service';

describe('ApprovingStatusService', () => {
  let service: ApprovingStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApprovingStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
