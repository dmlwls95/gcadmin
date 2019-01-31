import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoyaltiesCheckComponent } from './royalties-check.component';

describe('RoyaltiesCheckComponent', () => {
  let component: RoyaltiesCheckComponent;
  let fixture: ComponentFixture<RoyaltiesCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoyaltiesCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoyaltiesCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
