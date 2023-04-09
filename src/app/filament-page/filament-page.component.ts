import {AfterViewInit, Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';

import {Filament} from "../model/filament";
import {FILAMENTS} from "../../assets/filaments-data";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'filament-page',
  templateUrl: './filament-page.component.html',
  styleUrls: ['./filament-page.component.css']
})
export class FilamentPageComponent implements AfterViewInit {
  dataSource!: MatTableDataSource<Filament>;
  displayedColumns: string[] = ['manufacturer', 'materialDiameter', 'spoolPrice', 'spoolSize', 'density', 'nozzleTemp', 'bedTemp', 'actions'];

  @Input()
  selectedCurrency: string | undefined;

  @Output() filamentAddedEvent = new EventEmitter<Filament[]>();

  @ViewChild(MatSort) sort = new MatSort ;

  constructor(private dialog: MatDialog) {
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(FILAMENTS);
  }

  ngAfterViewInit(): void {
    if(this.dataSource) {
      this.dataSource.sort = this.sort;
    }
  }
}
