import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPrinterDialogComponent } from './edit-printer-dialog.component';

describe('EditPrinterDialogComponent', () => {
  let component: EditPrinterDialogComponent;
  let fixture: ComponentFixture<EditPrinterDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPrinterDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPrinterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
