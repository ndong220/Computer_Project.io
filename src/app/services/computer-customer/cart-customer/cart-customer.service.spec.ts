import { TestBed } from '@angular/core/testing';

import { CartCustomerService } from './cart-customer.service';

describe('CartCustomerService', () => {
  let service: CartCustomerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartCustomerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
