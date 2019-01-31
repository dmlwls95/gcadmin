import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayCheckComponent } from './pay-check.component';

describe('PayCheckComponent', () => {
  let component: PayCheckComponent;
  let fixture: ComponentFixture<PayCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
