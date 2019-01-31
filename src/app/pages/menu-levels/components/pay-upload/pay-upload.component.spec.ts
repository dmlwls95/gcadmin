import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayUploadComponent } from './pay-upload.component';

describe('PayUploadComponent', () => {
  let component: PayUploadComponent;
  let fixture: ComponentFixture<PayUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
