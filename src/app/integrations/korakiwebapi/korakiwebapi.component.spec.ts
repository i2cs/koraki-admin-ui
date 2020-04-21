import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KorakiwebapiComponent } from './korakiwebapi.component';

describe('KorakiwebapiComponent', () => {
  let component: KorakiwebapiComponent;
  let fixture: ComponentFixture<KorakiwebapiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KorakiwebapiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KorakiwebapiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
