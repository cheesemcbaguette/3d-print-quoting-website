import {Injectable, OnInit} from '@angular/core';
import {Printer} from "../model/printer";
import {LocalService} from "./local.service";
import {PRINTERS} from "../../assets/printers-data";

@Injectable({
  providedIn: 'root'
})
export class PrintersService{
  private printers: Printer[] = [];
  private localStorageKey = "printers"

  constructor(private localService: LocalService) {
    const json = this.localService.getItem(this.localStorageKey)


    if(json != null) {
      const localPrinters: Printer[] = JSON.parse(<string>json);
      if(localPrinters.length > 0) {
        this.printers = localPrinters;
      } else {
        this.printers = PRINTERS;
      }

    } else {
      this.printers = PRINTERS;
    }
  }

  getPrinters(): Printer[] {
    return this.printers;
  }

  editPrinters(printers: Printer[]): void {
    this.printers = printers;
    // Store the object into storage
    this.localService.setItem(this.localStorageKey, JSON.stringify(this.printers));
  }
}
