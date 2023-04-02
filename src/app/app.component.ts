import {Component} from '@angular/core';
import {PRINTERS} from "../assets/printers-data";
import {Printer} from "./model/printer";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'printing-quoting-sheet';

  active = 1;

  selectedCurrency = "";

  printers: Printer[] = [];

  constructor() { }

  onCurrencySelected(currency: string) {
    this.selectedCurrency = currency;
    console.log(currency);
  }

  onPrinterAdded(newPrinters: Printer[]) {
    this.printers = newPrinters;
  }
}
