import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CestaPaso2Component } from './cesta-paso2.component';

describe('CestaPaso2Component', () => {
  let component: CestaPaso2Component;
  let fixture: ComponentFixture<CestaPaso2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CestaPaso2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CestaPaso2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
