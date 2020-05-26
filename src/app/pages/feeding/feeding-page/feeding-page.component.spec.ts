import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedingPageComponent } from './feeding-page.component';

describe('FeedingPageComponent', () => {
  let component: FeedingPageComponent;
  let fixture: ComponentFixture<FeedingPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedingPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
