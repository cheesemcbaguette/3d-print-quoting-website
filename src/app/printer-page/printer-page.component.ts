import {
  AfterViewInit,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import {Printer} from "../model/printer";
import {PRINTERS} from "../../assets/printers-data";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {DialogPosition, MatDialog} from "@angular/material/dialog";
import {AddPrinterDialogComponent} from "../dialogs/add-printer-dialog/add-printer-dialog.component";
import {EditPrinterDialogComponent} from "../dialogs/edit-printer-dialog/edit-printer-dialog.component";

@Component({
  selector: 'printer-page',
  templateUrl: './printer-page.component.html',
  styleUrls: ['./printer-page.component.css']
})
export class PrinterPageComponent implements AfterViewInit {
  dataSource!: MatTableDataSource<Printer>;
  displayedColumns: string[] = ['name', 'materialDiameter', 'price', 'depreciationTime', 'serviceCostPerLife', 'energyConsumption', 'depreciation', 'actions'];

  rowToDeleteIndex: number | undefined;

  @Input()
  selectedCurrency: string | undefined;

  @Output() printerAddedEvent = new EventEmitter<Printer[]>();

  @ViewChild(MatSort) sort = new MatSort ;

  constructor(private modalService: NgbModal, private dialog: MatDialog) {
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(PRINTERS);
  }

  ngAfterViewInit() {
    if(this.dataSource) {
      this.dataSource.sort = this.sort;
    }
  }

  openAddPrinterDialog() {
    let dialog = this.dialog.open(AddPrinterDialogComponent, {

      data: { currency: this.selectedCurrency },
    });
    dialog.afterClosed()
      .subscribe(newPrinter => {
        if (newPrinter && this.dataSource) {
            const newData = [ ...this.dataSource.data ];
            newData.push(newPrinter);
            this.dataSource.data = newData;

            this.printerAddedEvent.emit(this.dataSource.data)
        } else {
          // User clicked 'Cancel' or clicked outside the dialog
        }
      });
  }

  openEditPrinterDialog(index: number) {
    let printer : Printer = this.dataSource.data[index];
    let dialog = this.dialog.open(EditPrinterDialogComponent, {

      data: { currency: this.selectedCurrency, printer: printer },
    });
    dialog.afterClosed()
      .subscribe(newPrinter => {
        if (newPrinter && this.dataSource) {
          const newData = [ ...this.dataSource.data ];
          newData[index] = newPrinter;

          this.dataSource.data = newData;

          this.printerAddedEvent.emit(this.dataSource.data)
        } else {
          // User clicked 'Cancel' or clicked outside the dialog
        }
      });
  }

  openModal(content: any, title: string) {
    this.modalService.open(content, { ariaLabelledBy: title }).result.then(
      (result) => {

      },
      (reason) => {

      },
    );
  }

  openDeleteModal(content: any, index: number, title: string) {
    this.rowToDeleteIndex = index;
    this.openModal(content, title);
  }

  deletePrinterToTable() {
    if(this.dataSource) {
      this.dataSource.data = this.dataSource.data.filter((item, index) => index !== this.rowToDeleteIndex);

      this.printerAddedEvent.emit(this.dataSource.data)
    }

    this.modalService.dismissAll();
  }
}
