import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartsCheckComponent } from './charts-check.component';

describe('ChartsCheckComponent', () => {
  let component: ChartsCheckComponent;
  let fixture: ComponentFixture<ChartsCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartsCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartsCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
