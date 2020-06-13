import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CestaPaso3Component } from './cesta-paso3.component';

describe('CestaPaso3Component', () => {
  let component: CestaPaso3Component;
  let fixture: ComponentFixture<CestaPaso3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CestaPaso3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CestaPaso3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
