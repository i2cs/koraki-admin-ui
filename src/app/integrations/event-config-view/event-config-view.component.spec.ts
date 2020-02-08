import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventConfigViewComponent } from './event-config-view.component';

describe('EventConfigViewComponent', () => {
  let component: EventConfigViewComponent;
  let fixture: ComponentFixture<EventConfigViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventConfigViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventConfigViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
