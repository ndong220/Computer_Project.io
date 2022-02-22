import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryMetaItemComponent } from './category-meta-item.component';

describe('CategoryMetaItemComponent', () => {
  let component: CategoryMetaItemComponent;
  let fixture: ComponentFixture<CategoryMetaItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CategoryMetaItemComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryMetaItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
