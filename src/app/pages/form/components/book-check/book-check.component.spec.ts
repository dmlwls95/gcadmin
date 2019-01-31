import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookCheckComponent } from './book-check.component';

describe('BookCheckComponent', () => {
  let component: BookCheckComponent;
  let fixture: ComponentFixture<BookCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
