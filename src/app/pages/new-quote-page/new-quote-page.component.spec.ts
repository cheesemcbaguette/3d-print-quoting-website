import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewQuotePageComponent } from './new-quote-page.component';

describe('HomepageComponent', () => {
  let component: NewQuotePageComponent;
  let fixture: ComponentFixture<NewQuotePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewQuotePageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewQuotePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
