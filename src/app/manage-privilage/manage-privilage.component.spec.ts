import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePrivilageComponent } from './manage-privilage.component';

describe('ManagePrivilageComponent', () => {
  let component: ManagePrivilageComponent;
  let fixture: ComponentFixture<ManagePrivilageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagePrivilageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagePrivilageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
