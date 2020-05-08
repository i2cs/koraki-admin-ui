import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WpContentRenderComponent } from './wp-content-render.component';

describe('WpContentRenderComponent', () => {
  let component: WpContentRenderComponent;
  let fixture: ComponentFixture<WpContentRenderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WpContentRenderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WpContentRenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
