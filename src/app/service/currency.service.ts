import {Injectable} from '@angular/core';
import {LocalService} from "./local.service";
import {Currency} from "../model/currency";

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private currency: Currency = {symbol: "€", code: "EUR"};
  private localStorageKey = "currency"
  constructor(private localService: LocalService) {
    try {
      this.currency = JSON.parse(<string>this.localService.getItem(this.localStorageKey));
    } catch (e) {

    }
  }

  getCurrency(): Currency {
    return this.currency
  }

  setCurrency(currency: Currency): void {
    this.currency = currency;
    // Store the object into storage
    try {
      this.localService.setItem(this.localStorageKey, JSON.stringify(this.currency));
    } catch (e) {

    }

  }
}
