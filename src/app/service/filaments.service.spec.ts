import { TestBed } from '@angular/core/testing';

import { FilamentsService } from './filaments.service';

describe('FilamentsService', () => {
  let service: FilamentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilamentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
