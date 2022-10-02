import {Component, Directive, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren} from '@angular/core';

import {Filament} from "../model/filament";
import {FILAMENTS} from "../../assets/filaments-data";

export type FilamentSortColumn = keyof Filament | '';
export type FilamentSortDirection = 'asc' | 'desc' | '';
const rotate: {[key: string]: FilamentSortDirection} = { 'asc': 'desc', 'desc': '', '': 'asc' };

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

export interface FilamentSortEvent {
  column: FilamentSortColumn;
  direction: FilamentSortDirection;
}

@Directive({
  selector: 'th[sortableF]',
  host: {
    '[class.asc]': 'directionF === "asc"',
    '[class.desc]': 'directionF === "desc"',
    '(click)': 'rotate()'
  }
})
export class FilamentSortableHeader {

  @Input() sortableF: FilamentSortColumn = '';
  @Input() directionF: FilamentSortDirection = '';
  @Output() sortFilament = new EventEmitter<FilamentSortEvent>();

  rotate() {
    this.directionF = rotate[this.directionF];
    this.sortFilament.emit({column: this.sortableF, direction: this.directionF});
  }
}

@Component({
  selector: 'filament-page',
  templateUrl: './filament-page.component.html',
  styleUrls: ['./filament-page.component.css']
})
export class FilamentPageComponent implements OnInit {

  filaments = FILAMENTS

  @ViewChildren(FilamentSortableHeader)
  headers!: QueryList<FilamentSortableHeader>;

  @Input()
  selectedCurrency: string | undefined;

  onSortFilament({column, direction}: FilamentSortEvent) {

    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortableF !== column) {
        header.directionF = '';
      }
    });

    // sorting filaments
    if (direction === '' || column === '') {
      this.filaments = FILAMENTS;
    } else {
      this.filaments = [...FILAMENTS].sort((a, b) => {
        const res = compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }

  constructor() { }

  ngOnInit(): void {
  }

}
