import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryMetaComponent } from './category-meta.component';

describe('CategoryMetaComponent', () => {
  let component: CategoryMetaComponent;
  let fixture: ComponentFixture<CategoryMetaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CategoryMetaComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryMetaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
