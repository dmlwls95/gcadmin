import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookOnlyCheckComponent } from './book-only-check.component';

describe('BookOnlyCheckComponent', () => {
  let component: BookOnlyCheckComponent;
  let fixture: ComponentFixture<BookOnlyCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookOnlyCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookOnlyCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
