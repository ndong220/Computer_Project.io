import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchByCodeComponent } from './search-by-code.component';

describe('SearchByCodeComponent', () => {
  let component: SearchByCodeComponent;
  let fixture: ComponentFixture<SearchByCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchByCodeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchByCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
