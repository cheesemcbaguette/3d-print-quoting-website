import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef, MatNoDataRow,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource
} from "@angular/material/table";
import {MatButton, MatFabButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatIconButtonSizesModule} from "mat-icon-button-sizes";
import {MatSort, MatSortHeader} from "@angular/material/sort";
import {NgIf} from "@angular/common";
import {QuoteSummary} from "../../model/quote-summary";
import {QUOTES_SUMMARY} from "../../../assets/quotes-summary-data";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'my-quotes',
  standalone: true,
  imports: [
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatFabButton,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatIcon,
    MatIconButton,
    MatIconButtonSizesModule,
    MatRow,
    MatRowDef,
    MatSort,
    MatSortHeader,
    MatTable,
    NgIf,
    MatNoDataRow,
    MatHeaderCellDef,
    MatButton,
    RouterLink
  ],
  templateUrl: './my-quotes-page.component.html',
  styleUrl: './my-quotes-page.component.scss'
})
export class MyQuotesPageComponent implements AfterViewInit{
  dataSource!: MatTableDataSource<QuoteSummary>;
  displayedColumns: string[] = ['customerName', 'date', 'cost', 'status', 'actions'];

  @ViewChild(MatSort) sort = new MatSort ;

  constructor() {
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(QUOTES_SUMMARY);
  }

  ngAfterViewInit(): void {
    if(this.dataSource) {
      this.dataSource.sort = this.sort;
    }
  }
}
