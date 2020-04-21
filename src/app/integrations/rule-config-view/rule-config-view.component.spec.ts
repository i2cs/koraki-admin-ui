import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleConfigViewComponent } from './rule-config-view.component';

describe('RuleConfigViewComponent', () => {
  let component: RuleConfigViewComponent;
  let fixture: ComponentFixture<RuleConfigViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RuleConfigViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RuleConfigViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
