import {Filament} from "./filament";
import {Printer} from "./printer";

export class QuoteRequest {
  preparationTime: number = 0;
  filamentWeight: number = 0;
  printingTime: number = 0;
  energyCost: number = 0;
  laborCost: number = 0;
  consumablesCost: number = 0;
  failureRate: number = 0;
  markupPercentage: number = 0;
  quantity: number = 0;

  filament: Filament;
  printer: Printer;

  constructor(filament: Filament, printer: Printer) {
    this.filament = filament;
    this.printer = printer;
  }
}
