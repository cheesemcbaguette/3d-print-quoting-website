import {AfterViewInit, Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';

import {Filament} from "../model/filament";
import {FILAMENTS} from "../../assets/filaments-data";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatDialog} from "@angular/material/dialog";
import {CurrencyService} from "../service/currency.service";
import {AddPrinterDialogComponent} from "../dialogs/add-printer-dialog/add-printer-dialog.component";
import {AddFilamentDialogComponent} from "../dialogs/add-filament-dialog/add-filament-dialog.component";
import {PrintersService} from "../service/printers.service";
import {FilamentsService} from "../service/filaments.service";

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

  constructor(private dialog: MatDialog, private currencyService: CurrencyService, private filamentsService: FilamentsService) {
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(filamentsService.getFilaments());
    this.selectedCurrency = currencyService.getCurrency();
  }

  ngAfterViewInit(): void {
    if(this.dataSource) {
      this.dataSource.sort = this.sort;
    }
  }

  openAddFilamentDialog() {
    let dialog = this.dialog.open(AddFilamentDialogComponent, {

      data: { currency: this.selectedCurrency },
    });
    dialog.afterClosed()
      .subscribe(newFilament => {
        if (newFilament && this.dataSource) {
          const newData = [ ...this.dataSource.data ];
          newData.push(newFilament);
          this.dataSource.data = newData;

          this.filamentsService.editFilaments(newData)
        } else {
          // User clicked 'Cancel' or clicked outside the dialog
        }
      });
  }
}
