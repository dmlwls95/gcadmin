import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoyaltiesUploadComponent } from './royalties-upload.component';

describe('RoyaltiesUploadComponent', () => {
  let component: RoyaltiesUploadComponent;
  let fixture: ComponentFixture<RoyaltiesUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoyaltiesUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoyaltiesUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
