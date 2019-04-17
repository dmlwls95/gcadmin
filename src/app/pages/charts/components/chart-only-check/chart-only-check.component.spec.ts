import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartOnlyCheckComponent } from './chart-only-check.component';

describe('ChartOnlyCheckComponent', () => {
  let component: ChartOnlyCheckComponent;
  let fixture: ComponentFixture<ChartOnlyCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartOnlyCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartOnlyCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
