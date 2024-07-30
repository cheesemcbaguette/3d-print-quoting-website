import { Injectable } from '@angular/core';
import {Printer} from "../model/printer";
import {LocalService} from "./local.service";

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private currency = "€";
  private localStorageKey = "currency"
  constructor(private localService: LocalService) {
    const currency = this.localService.getItem(this.localStorageKey)

    if(currency != null) {
      this.currency = currency;
    }
  }

  getCurrency(): string {
    return this.currency
  }

  setCurrency(currency: string): void {
    this.currency = currency;
    // Store the object into storage
    this.localService.setItem(this.localStorageKey, this.currency);
  }
}
