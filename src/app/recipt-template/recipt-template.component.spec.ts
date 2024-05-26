import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReciptTemplateComponent } from './recipt-template.component';

describe('ReciptTemplateComponent', () => {
  let component: ReciptTemplateComponent;
  let fixture: ComponentFixture<ReciptTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReciptTemplateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReciptTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
