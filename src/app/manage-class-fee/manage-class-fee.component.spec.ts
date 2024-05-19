import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageClassFeeComponent } from './manage-class-fee.component';

describe('ManageClassFeeComponent', () => {
  let component: ManageClassFeeComponent;
  let fixture: ComponentFixture<ManageClassFeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageClassFeeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageClassFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
