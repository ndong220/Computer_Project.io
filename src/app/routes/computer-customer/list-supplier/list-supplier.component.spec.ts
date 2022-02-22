import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSupplierComponent } from './list-supplier.component';

describe('ListSupplierComponent', () => {
  let component: ListSupplierComponent;
  let fixture: ComponentFixture<ListSupplierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListSupplierComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
