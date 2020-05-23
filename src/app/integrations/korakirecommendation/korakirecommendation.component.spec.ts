import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KorakirecommendationComponent } from './korakirecommendation.component';

describe('KorakiliveComponent', () => {
  let component: KorakirecommendationComponent;
  let fixture: ComponentFixture<KorakirecommendationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KorakirecommendationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KorakirecommendationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
