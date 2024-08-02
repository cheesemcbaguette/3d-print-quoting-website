import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteFilamentDialogComponent } from './delete-filament-dialog.component';

describe('DeleteFilamentDialogComponent', () => {
  let component: DeleteFilamentDialogComponent;
  let fixture: ComponentFixture<DeleteFilamentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteFilamentDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteFilamentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
