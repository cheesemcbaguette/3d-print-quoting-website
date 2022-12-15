import {AfterViewInit, Component, Input, ViewChild} from '@angular/core';
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
  displayedColumns: string[] = ['name', 'materialDiameter', 'price', 'depreciationTime', 'serviceCostPerLife', 'energyConsumption', 'depreciation'];

  @Input()
  selectedCurrency: string | undefined;

  @ViewChild(MatSort) sort = new MatSort ;

  constructor(private modalService: NgbModal) {
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(PRINTERS);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  open(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {

      },
      (reason) => {

      },
    );
  }
}
