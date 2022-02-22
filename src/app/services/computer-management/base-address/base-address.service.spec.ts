import { TestBed } from '@angular/core/testing';

import { BaseAddressService } from './base-address.service';

describe('BaseAddressService', () => {
  let service: BaseAddressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BaseAddressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
