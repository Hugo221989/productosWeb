import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedingDetailComponent } from './feeding-detail.component';

describe('FeedingDetailComponent', () => {
  let component: FeedingDetailComponent;
  let fixture: ComponentFixture<FeedingDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedingDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedingDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
