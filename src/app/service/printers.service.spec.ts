import { TestBed } from '@angular/core/testing';

import { PrintersService } from './printers.service';

describe('PrintersService', () => {
  let service: PrintersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrintersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
