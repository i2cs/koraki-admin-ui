import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionMainComponent } from './subscription-main.component';

describe('SubscriptionMainComponent', () => {
  let component: SubscriptionMainComponent;
  let fixture: ComponentFixture<SubscriptionMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscriptionMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
