import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoyaltiesPeriodComponent } from './royalties-period.component';

describe('RoyaltiesPeriodComponent', () => {
  let component: RoyaltiesPeriodComponent;
  let fixture: ComponentFixture<RoyaltiesPeriodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoyaltiesPeriodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoyaltiesPeriodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
