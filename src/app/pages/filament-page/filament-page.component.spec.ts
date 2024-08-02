import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilamentPageComponent } from './filament-page.component';

describe('FilamentPageComponent', () => {
  let component: FilamentPageComponent;
  let fixture: ComponentFixture<FilamentPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilamentPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilamentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
