import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZapierComponent } from './zapier.component';

describe('ZapierComponent', () => {
  let component: ZapierComponent;
  let fixture: ComponentFixture<ZapierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZapierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZapierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
