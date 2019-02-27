import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoyaltiePayedComponent } from './royaltie-payed.component';

describe('RoyaltiePayedComponent', () => {
  let component: RoyaltiePayedComponent;
  let fixture: ComponentFixture<RoyaltiePayedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoyaltiePayedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoyaltiePayedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
