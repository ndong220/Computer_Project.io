import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsLockCellRenderComponent } from './is-lock-cell-render.component';

describe('IsLockCellRenderComponent', () => {
  let component: IsLockCellRenderComponent;
  let fixture: ComponentFixture<IsLockCellRenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IsLockCellRenderComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsLockCellRenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
