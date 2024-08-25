import {AfterViewInit, Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {Printer} from "../../model/printer";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatDialog} from "@angular/material/dialog";
import {AddPrinterDialogComponent} from "../../components/dialogs/add-printer-dialog/add-printer-dialog.component";
import {DeletePrinterDialogComponent} from "../../components/dialogs/delete-printer-dialog/delete-printer-dialog.component";
import {PrintersService} from "../../service/printers.service";
import {CurrencyService} from "../../service/currency.service";
import {Currency} from "../../model/currency";
import {PRINTERS} from "../../../assets/printers-data";

@Component({
  selector: 'printer-page',
  templateUrl: './printer-page.component.html',
  styleUrls: ['./printer-page.component.css']
})
export class PrinterPageComponent implements AfterViewInit {
  dataSource!: MatTableDataSource<Printer>;
  displayedColumns: string[] = ['name', 'materialDiameter', 'price', 'depreciationTime', 'serviceCostPerLife', 'energyConsumption', 'depreciation', 'actions'];

  selectedCurrency: Currency;

  @ViewChild(MatSort) sort = new MatSort ;

  constructor(private dialog: MatDialog, private printersService: PrintersService, private currencyService: CurrencyService){
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(printersService.getPrinters());
    this.selectedCurrency = currencyService.getCurrency();
  }

  ngAfterViewInit() {
    if(this.dataSource) {
      this.dataSource.sort = this.sort;
    }
  }

  openAddPrinterDialog() {
    let dialog = this.dialog.open(AddPrinterDialogComponent, {

      data: { title: "Add new printer" },
    });
    dialog.afterClosed()
      .subscribe(newPrinter => {
        if (newPrinter && this.dataSource) {
            const newData = [ ...this.dataSource.data ];
            newData.push(newPrinter);
            this.dataSource.data = newData;

            this.printersService.editPrinters(newData)
        } else {
          // User clicked 'Cancel' or clicked outside the dialog
        }
      });
  }

  openEditPrinterDialog(index: number) {
    let printer : Printer = this.dataSource.data[index];
    let dialog = this.dialog.open(AddPrinterDialogComponent, {

      data: { printer: printer, title: "Edit printer" },
    });
    dialog.afterClosed()
      .subscribe(newPrinter => {
        if (newPrinter && this.dataSource) {
          const newData = [ ...this.dataSource.data ];
          newData[index] = newPrinter;

          this.dataSource.data = newData;

          this.printersService.editPrinters(newData)
        } else {
          // User clicked 'Cancel' or clicked outside the dialog
        }
      });
  }

  openDeletePrinterDialog(index: number) {

    let dialog = this.dialog.open(DeletePrinterDialogComponent, {data: {printerName: this.dataSource.data[index].name}});
    dialog.afterClosed()
      .subscribe(doDelete => {
        if (doDelete) {
          this.dataSource.data = this.dataSource.data.filter((item, datasourceIndex) => datasourceIndex !== index);

          this.printersService.editPrinters(this.dataSource.data)
        } else {
          // User clicked 'Cancel' or clicked outside the dialog
        }
      });
  }

  resetPrinterList() {
    this.dataSource.data = PRINTERS

    this.printersService.editPrinters(this.dataSource.data)
  }

  importPrinterList(event: Event) {

  }

  exportPrinterList() {

  }
}
