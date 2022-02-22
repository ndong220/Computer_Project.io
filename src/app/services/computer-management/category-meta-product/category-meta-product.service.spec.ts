import { TestBed } from '@angular/core/testing';

import { CategoryMetaProductService } from './category-meta-product.service';

describe('CategoryMetaProductService', () => {
  let service: CategoryMetaProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoryMetaProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
