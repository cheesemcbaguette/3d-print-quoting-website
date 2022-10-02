import {Component} from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'printing-quoting-sheet';

  active = 1;

  selectedCurrency = "";

  constructor() { }

  onCurrencySelected(currency: string) {
    this.selectedCurrency = currency;
    console.log(currency);
  }
}
