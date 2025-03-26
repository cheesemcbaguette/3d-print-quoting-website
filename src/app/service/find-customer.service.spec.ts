import { TestBed } from '@angular/core/testing';

import { FindCustomerService } from './find-customer.service';

describe('FindCustomerService', () => {
  let service: FindCustomerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FindCustomerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
