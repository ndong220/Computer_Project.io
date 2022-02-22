import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductReviewItemComponent } from './product-review-item.component';

describe('ProductReviewItemComponent', () => {
  let component: ProductReviewItemComponent;
  let fixture: ComponentFixture<ProductReviewItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductReviewItemComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductReviewItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
