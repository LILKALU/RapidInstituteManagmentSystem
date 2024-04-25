import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RapidSystemComponent } from './rapid-system.component';

describe('RapidSystemComponent', () => {
  let component: RapidSystemComponent;
  let fixture: ComponentFixture<RapidSystemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RapidSystemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RapidSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
