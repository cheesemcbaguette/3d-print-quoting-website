import {AfterViewInit, Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {Printer} from "../model/printer";
import {PRINTERS} from "../../assets/printers-data";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'printer-page',
  templateUrl: './printer-page.component.html',
  styleUrls: ['./printer-page.component.css']
})
export class PrinterPageComponent implements AfterViewInit {
  dataSource: MatTableDataSource<Printer>;
  displayedColumns: string[] = ['name', 'materialDiameter', 'price', 'depreciationTime', 'serviceCostPerLife', 'energyConsumption', 'depreciation', 'actions'];

  rowToDeleteIndex: number | undefined;

  @Input()
  selectedCurrency: string | undefined;

  @Output() printerAddedEvent = new EventEmitter<Printer[]>();

  @ViewChild(MatSort) sort = new MatSort ;

  constructor(private modalService: NgbModal) {
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(PRINTERS);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;

    this.printerAddedEvent.emit(this.dataSource.data)
  }

  open(content: any, title: string) {
    this.modalService.open(content, { ariaLabelledBy: title }).result.then(
      (result) => {

      },
      (reason) => {

      },
    );
  }

  openDeleteModal(content: any, index: number, title: string) {
    this.rowToDeleteIndex = index;
    this.modalService.open(content, { ariaLabelledBy: title }).result.then(
      (result) => {

      },
      (reason) => {

      },
    );
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

    const newData = [ ...this.dataSource.data ];
    newData.push(newPrinter);
    this.dataSource.data = newData;

    this.printerAddedEvent.emit(this.dataSource.data)

    this.modalService.dismissAll();
  }

  deletePrinterToTable() {
    this.dataSource.data = this.dataSource.data.filter((item, index) => index !== this.rowToDeleteIndex);

    this.printerAddedEvent.emit(this.dataSource.data)

    this.modalService.dismissAll();
  }
}
