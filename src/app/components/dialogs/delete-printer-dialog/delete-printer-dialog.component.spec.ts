import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePrinterDialogComponent } from './delete-printer-dialog.component';

describe('DeletePrinterDialogComponent', () => {
  let component: DeletePrinterDialogComponent;
  let fixture: ComponentFixture<DeletePrinterDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeletePrinterDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeletePrinterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
