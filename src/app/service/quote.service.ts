import { Injectable } from '@angular/core';
import {QuoteResponse} from "../model/quote-response";
import {QuoteRequest} from "../model/quote-request";

@Injectable({
  providedIn: 'root'
})
export class QuoteService {

  constructor() { }

  calculateQuote(quoteRequest: QuoteRequest): QuoteResponse {
    const quoteResponse = new QuoteResponse();

    //divide weight by 1000 because weight is in grams and filamentWeight is in kg
    quoteResponse.filamentPrice = (quoteRequest.filamentWeight / 1000) * (quoteRequest.filament.spoolPrice / quoteRequest.filament.filamentWeight);

    quoteResponse.electricityCost = quoteRequest.printer.energyConsumption * quoteRequest.energyCost * quoteRequest.printingTime;

    // calculate deprecation cost
    quoteResponse.deprecationCost = quoteRequest.printer.depreciation * quoteRequest.printingTime

    //calculate preparation cost
    quoteResponse.preparationCost = quoteRequest.preparationTime / 60 * quoteRequest.laborCost;

    // calculate subtotal
    quoteResponse.subTotal = quoteResponse.filamentPrice + quoteResponse.electricityCost
      + quoteResponse.deprecationCost + quoteResponse.preparationCost + quoteRequest.consumablesCost

    // calculate subtotal + failure rate % cost
    if(quoteRequest.failureRate) {
      quoteResponse.subTotalWithFailures = quoteResponse.subTotal * (quoteRequest.failureRate / 100 + 1);
    } else {
      quoteResponse.subTotalWithFailures = quoteResponse.subTotal;
    }

    // calculate suggested price with markup
    if(quoteRequest.markupPercentage && quoteRequest.markupPercentage != 0) {
      quoteResponse.suggestedPrice = quoteResponse.subTotalWithFailures * (quoteRequest.markupPercentage / 100);
    } else {
      quoteResponse.suggestedPrice = quoteResponse.subTotalWithFailures;
    }


    return quoteResponse;
  }
}
