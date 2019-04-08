import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoyaltiesPayingComponent } from './royalties-paying.component';

describe('RoyaltiesPayingComponent', () => {
  let component: RoyaltiesPayingComponent;
  let fixture: ComponentFixture<RoyaltiesPayingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoyaltiesPayingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoyaltiesPayingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
