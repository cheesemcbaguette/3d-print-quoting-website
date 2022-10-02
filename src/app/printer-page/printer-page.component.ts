import {Component, Directive, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren} from '@angular/core';
import {Printer} from "../model/printer";
import {PRINTERS} from "../../assets/printers-data";

export type PrinterSortColumn = keyof Printer | '';
export type PrinterSortDirection = 'asc' | 'desc' | '';
const rotate: {[key: string]: PrinterSortDirection} = { 'asc': 'desc', 'desc': '', '': 'asc' };

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

export interface PrinterSortEvent {
  column: PrinterSortColumn;
  direction: PrinterSortDirection;
}

@Directive({
  selector: 'th[sortable]',
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()'
  }
})
export class NgbdSortableHeader {

  @Input() sortable: PrinterSortColumn = '';
  @Input() direction: PrinterSortDirection = '';
  @Output() sort = new EventEmitter<PrinterSortEvent>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({column: this.sortable, direction: this.direction});
  }
}

@Component({
  selector: 'printer-page',
  templateUrl: './printer-page.component.html',
  styleUrls: ['./printer-page.component.css']
})
export class PrinterPageComponent implements OnInit {

  printers = PRINTERS

  @Input()
  selectedCurrency: string | undefined;

  @ViewChildren(NgbdSortableHeader)
  headers!: QueryList<NgbdSortableHeader>;

  onSort({column, direction}: PrinterSortEvent) {

    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    // sorting printers
    if (direction === '' || column === '') {
      this.printers = PRINTERS;
    } else {
      this.printers = [...PRINTERS].sort((a, b) => {
        const res = compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }

  constructor() { }

  ngOnInit(): void {
  }

}
