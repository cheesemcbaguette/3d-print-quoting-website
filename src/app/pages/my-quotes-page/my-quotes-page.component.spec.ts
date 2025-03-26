import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyQuotesPageComponent } from './my-quotes-page.component';

describe('MyQuotesPageComponent', () => {
  let component: MyQuotesPageComponent;
  let fixture: ComponentFixture<MyQuotesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyQuotesPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyQuotesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
