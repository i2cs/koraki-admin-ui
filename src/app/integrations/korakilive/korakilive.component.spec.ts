import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KorakiliveComponent } from './korakilive.component';

describe('KorakiliveComponent', () => {
  let component: KorakiliveComponent;
  let fixture: ComponentFixture<KorakiliveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KorakiliveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KorakiliveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
