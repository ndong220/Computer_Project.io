import { TestBed } from '@angular/core/testing';

import { CategoryMetaService } from './category-meta.service';

describe('CategoryMetaService', () => {
  let service: CategoryMetaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoryMetaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
