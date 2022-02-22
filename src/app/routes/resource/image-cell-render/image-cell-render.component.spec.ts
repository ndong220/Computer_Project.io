import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageCellRenderComponent } from './image-cell-render.component';

describe('ImageCellRenderComponent', () => {
  let component: ImageCellRenderComponent;
  let fixture: ComponentFixture<ImageCellRenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImageCellRenderComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageCellRenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
