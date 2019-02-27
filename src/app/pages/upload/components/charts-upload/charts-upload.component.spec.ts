import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartsUploadComponent } from './charts-upload.component';

describe('ChartsUploadComponent', () => {
  let component: ChartsUploadComponent;
  let fixture: ComponentFixture<ChartsUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartsUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartsUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
