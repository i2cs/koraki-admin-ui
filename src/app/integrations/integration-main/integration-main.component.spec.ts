import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegrationMainComponent } from './integration-main.component';

describe('IntegrationMainComponent', () => {
  let component: IntegrationMainComponent;
  let fixture: ComponentFixture<IntegrationMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntegrationMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntegrationMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
