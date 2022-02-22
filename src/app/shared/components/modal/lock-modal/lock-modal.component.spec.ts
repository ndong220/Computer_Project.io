import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LockModalComponent } from './lock-modal.component';

describe('LockModalComponent', () => {
  let component: LockModalComponent;
  let fixture: ComponentFixture<LockModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LockModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LockModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
