import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFilamentDialogComponent } from './add-filament-dialog.component';

describe('AddFilamentDialogComponent', () => {
  let component: AddFilamentDialogComponent;
  let fixture: ComponentFixture<AddFilamentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddFilamentDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddFilamentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
