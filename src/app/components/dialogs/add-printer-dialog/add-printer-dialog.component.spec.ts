import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPrinterDialogComponent } from './add-printer-dialog.component';

describe('AddPrinterDialogComponent', () => {
  let component: AddPrinterDialogComponent;
  let fixture: ComponentFixture<AddPrinterDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPrinterDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPrinterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
