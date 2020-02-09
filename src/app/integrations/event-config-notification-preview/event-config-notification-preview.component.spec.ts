import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventConfigNotificationPreviewComponent } from './event-config-notification-preview.component';

describe('EventConfigNotificationPreviewComponent', () => {
  let component: EventConfigNotificationPreviewComponent;
  let fixture: ComponentFixture<EventConfigNotificationPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventConfigNotificationPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventConfigNotificationPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
