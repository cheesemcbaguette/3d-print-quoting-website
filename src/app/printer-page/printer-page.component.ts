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

@Component({
  selector: 'printer-page',
  templateUrl: './printer-page.component.html',
  styleUrls: ['./printer-page.component.css']
})
export class PrinterPageComponent implements AfterViewInit {
  dataSource!: MatTableDataSource<Printer>;
  displayedColumns: string[] = ['name', 'materialDiameter', 'price', 'depreciationTime', 'serviceCostPerLife', 'energyConsumption', 'depreciation', 'actions'];

  rowToDeleteIndex: number | undefined;
  rowToEditIndex: number | undefined;

  @Input()
  selectedCurrency: string | undefined;

  @Output() printerAddedEvent = new EventEmitter<Printer[]>();

  @ViewChild(MatSort) sort = new MatSort ;

  @ContentChild('editPrinterName') editPrinterName!: ElementRef;
  @ContentChild('editPrinterFilamentDiameterSelect') editPrinterFilamentDiameterSelect!: HTMLSelectElement;
  @ContentChild('editPrinterPrice') editPrinterPrice!: ElementRef;
  @ContentChild('editPrinterDepreciationTime') editPrinterDepreciationTime!: ElementRef;
  @ContentChild('editPrinterServiceCost') editPrinterServiceCost!: ElementRef;
  @ContentChild('editPrinterEnergyConsumption') editPrinterEnergyConsumption!: ElementRef;

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
      .subscribe(selection => {
        if (selection) {
          // this.selectedEmoji = selection;
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

  openEditModal(content: any, index: number, title: string) {
    this.rowToEditIndex = index;

    let printer : Printer = this.dataSource.data[index];

    this.openModal(content, title);

    this.editPrinterName.nativeElement.value = printer.name;
    this.editPrinterFilamentDiameterSelect.value = String(printer.materialDiameter)
    this.editPrinterPrice.nativeElement.value = printer.price;
    this.editPrinterDepreciationTime.nativeElement.value = printer.depreciationTime;
    this.editPrinterServiceCost.nativeElement.value = printer.serviceCostPerLife;
    this.editPrinterEnergyConsumption.nativeElement.value = printer.energyConsumption;
  }

  addNewPrinterToTable(printerName: string, filamentDiameterSelect: string, printerPrice: string,
                       printerDepreciationTime: string, printerServiceCost: string, printerEnergyConsumption: string) {
    const price = Number(printerPrice);
    const serviceCost = Number(printerServiceCost);
    const depreciationTime = Number(printerDepreciationTime);
    const filamentDiameter = Number(filamentDiameterSelect);
    const energyConsumption = Number(printerEnergyConsumption);
    const depreciation = (price + serviceCost) / depreciationTime;

    let newPrinter : Printer = {name: printerName, materialDiameter: filamentDiameter, price: price, depreciationTime: depreciationTime, serviceCostPerLife: serviceCost, energyConsumption, depreciation};

    if(this.dataSource) {
      const newData = [ ...this.dataSource.data ];
      newData.push(newPrinter);
      this.dataSource.data = newData;

      this.printerAddedEvent.emit(this.dataSource.data)
    }


    this.modalService.dismissAll();
  }

  deletePrinterToTable() {
    if(this.dataSource) {
      this.dataSource.data = this.dataSource.data.filter((item, index) => index !== this.rowToDeleteIndex);

      this.printerAddedEvent.emit(this.dataSource.data)
    }

    this.modalService.dismissAll();
  }
}
