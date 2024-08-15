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
      const json = this.localService.getItem(this.localStorageKey)

      if(json != null) {
        this.currency = JSON.parse(json);
      }
    } catch (e) {

    }
  }

  getCurrency(): Currency {
    return this.currency
  }

  getDefaultCurrency(): Currency {
    return {symbol: "€", code: "EUR"};
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
