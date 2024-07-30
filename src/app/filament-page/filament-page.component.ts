import {AfterViewInit, Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';

import {Filament} from "../model/filament";
import {FILAMENTS} from "../../assets/filaments-data";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatDialog} from "@angular/material/dialog";
import {CurrencyService} from "../service/currency.service";

@Component({
  selector: 'filament-page',
  templateUrl: './filament-page.component.html',
  styleUrls: ['./filament-page.component.css']
})
export class FilamentPageComponent implements AfterViewInit {
  dataSource!: MatTableDataSource<Filament>;
  displayedColumns: string[] = ['manufacturer', 'materialDiameter', 'spoolPrice', 'spoolSize', 'density', 'nozzleTemp', 'bedTemp', 'actions'];

  selectedCurrency: string;

  @Output() filamentAddedEvent = new EventEmitter<Filament[]>();

  @ViewChild(MatSort) sort = new MatSort ;

  constructor(private dialog: MatDialog, private currencyService: CurrencyService) {
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(FILAMENTS);
    this.selectedCurrency = currencyService.getCurrency();
  }

  ngAfterViewInit(): void {
    if(this.dataSource) {
      this.dataSource.sort = this.sort;
    }
  }
}
