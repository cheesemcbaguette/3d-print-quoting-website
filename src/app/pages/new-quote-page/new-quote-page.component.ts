import {AfterViewInit, Component, ElementRef, Injectable, ViewChild} from '@angular/core';
import {NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct} from "@ng-bootstrap/ng-bootstrap";
import {Printer} from "../../model/printer";
import {PrintersService} from "../../service/printers.service";
import {CurrencyService} from "../../service/currency.service";
import {FilamentsService} from "../../service/filaments.service";
import {Filament} from "../../model/filament";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {LocalService} from "../../service/local.service";
import {Currency} from "../../model/currency";
import {CURRENCIES} from "../../../assets/currencies-data";
import {FileUtils} from "../../utils/FileUtils";
import {QuoteRequest} from "../../model/quote-request";
import {QuoteService} from "../../service/quote.service";
import {debounceTime, distinctUntilChanged, filter, Observable, of, switchMap} from "rxjs";
import {FindCustomerService} from "../../service/find-customer.service";
import {map} from "rxjs/operators";


/**
 * This Service handles how the date is represented in scripts i.e. ngModel.
 */
@Injectable()
export class CustomAdapter extends NgbDateAdapter<string> {

  readonly DELIMITER = '-';

  fromModel(value: string | null): NgbDateStruct | null {
    if (value) {
      const date = value.split(this.DELIMITER);
      return {
        day : parseInt(date[0], 10),
        month : parseInt(date[1], 10),
        year : parseInt(date[2], 10)
      };
    }
    return null;
  }

  toModel(date: NgbDateStruct | null): string | null {
    return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : null;
  }
}

/**
 * This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
 */
@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {

  readonly DELIMITER = '/';


  parse(value: string): NgbDateStruct | null {
    if (value) {
      const date = value.split(this.DELIMITER);
      return {
        day : parseInt(date[0], 10),
        month : parseInt(date[1], 10),
        year : parseInt(date[2], 10)
      };
    }
    return null;
  }

  format(date: NgbDateStruct | null): string {
    let formattedValue = ''
    if(date) {
      formattedValue = date.day + this.DELIMITER;
      if(date.month < 10) {
        formattedValue = formattedValue + "0" + date.month + this.DELIMITER + date.year;
      } else {
        formattedValue = formattedValue + date.month + this.DELIMITER + date.year;
      }

    }

    return formattedValue;
  }
}

@Component({
  selector: 'new-quote-page',
  templateUrl: './new-quote-page.component.html',
  styleUrls: ['./new-quote-page.component.scss'],

  // NOTE: For this example we are only providing current component, but probably
  // NOTE: you will want to provide your main App Module
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class NewQuotePageComponent implements AfterViewInit  {

  customers$: Observable<string[]>;

  @ViewChild('currencySelect') currencySelect!: ElementRef;

  @ViewChild('filamentSelect') filamentSelect!: ElementRef;

  printers: Printer[] | undefined;
  filaments: Filament[] | undefined;
  currencies: Currency[] = CURRENCIES;

  saleData = [
    { name: "Preparation", value: 25 },
    { name: "Filament", value: 25 },
    { name: "Electricity", value: 25 },
    { name: "Printer depreciation", value: 25 },
  ];

  model: string | undefined;

  selectedCurrency : Currency | undefined;
  selectedPrinter: Printer | undefined;

  labelClass = "col-sm-6 col-form-label"
  inputDivClass = "col-sm-6"

  /*Form validations*/
  public quoteForm = new FormGroup({
    printerFormControl: new FormControl("", [Validators.required,]),
    filamentFormControl: new FormControl("", [Validators.required,]),
    printWeightFormControl: new FormControl("", [Validators.required,]),
    nameFormControl: new FormControl("", []),
    dateFormControl: new FormControl("", []),
    descriptionFormControl: new FormControl("", []),
    printTimeHoursFormControl: new FormControl("", [Validators.required,]),

    modelPreparationFormControl: new FormControl("", []),
    slicingFormControl: new FormControl("", []),
    materialChangeFormControl: new FormControl("", []),
    transferAndStartFormControl: new FormControl("", []),
    additionalWorkFormControl: new FormControl("", []),
    preparationTimeTotalFormControl: new FormControl({value: "0", disabled: true}),

    consumablesFormControl: new FormControl("", []),
    energyCostFormControl: new FormControl("", [Validators.required,]),
    laborCostFormControl: new FormControl("", []),
    failureRateFormControl: new FormControl("", []),
    currencyFormControl: new FormControl("", []),

    filamentCostSummaryFormControl: new FormControl({value: "0", disabled: true}),
    electricityCostSummaryFormControl: new FormControl({value: "0", disabled: true}),
    printerDeprecationCostSummaryFormControl: new FormControl({value: "0", disabled: true}),
    preparationCostSummaryFormControl: new FormControl({value: "0", disabled: true}),
    consumablesCostSummaryFormControl: new FormControl({value: "0", disabled: true}),
    subtotalCostSummaryFormControl: new FormControl({value: "0", disabled: true}),
    subtotalWithFailuresCostSummaryFormControl: new FormControl({value: "0", disabled: true}),
    markupCostSummaryFormControl: new FormControl("120", []),
    suggestedPriceCostSummaryFormControl: new FormControl({value: "0", disabled: true}),
  });

  constructor(private printersService: PrintersService, private currencyService: CurrencyService,
              public filamentsService: FilamentsService, public localService: LocalService,
              public quoteService: QuoteService, private findCustomerService: FindCustomerService) {

    this.customers$ = this.quoteForm.controls.nameFormControl.valueChanges.pipe(
      map(value => value?.trim() || ''), // Supprime les espaces vides et empêche null
      distinctUntilChanged(), // Évite les requêtes inutiles si la valeur est identique
      switchMap(value => value.length ? this.findCustomerService.search(value) : of([])) // Si vide, renvoie un tableau vide
    );
  }

  ngAfterViewInit(): void {
    this.printers = this.printersService.getPrinters();
    this.selectedCurrency = this.currencyService.getCurrency();
    //set currency from cache
    this.quoteForm.get("currencyFormControl")?.setValue(this.selectedCurrency.code, {emitEvent: false})

    //calculate quote on code change if the form is valid
    this.quoteForm.valueChanges.subscribe(value => {
      //save form to cache
      const jsonFormValue = JSON.stringify(this.quoteForm.value)
      this.localService.setItem("form", jsonFormValue)

      if(this.quoteForm.valid && this.filaments && this.printers) {
        this.calculateQuote(this.filaments[Number(this.quoteForm.controls['filamentFormControl'].value)], this.printers[Number(this.quoteForm.controls['printerFormControl'].value)]);
      } else {
        //if form isn't valid, parse through controls to display them as invalid
        const controls = this.quoteForm.controls;
        Object.keys(controls).forEach(key => {
          const control = this.quoteForm.get(key);
          if (control!.invalid) {
            control!.markAllAsTouched()
          }
        });
      }
    })

    //get form from cache
    const localForm = this.localService.getItem("form");
    if(localForm) {
      this.quoteForm.patchValue(JSON.parse(localForm), {emitEvent: true})

      if (this.quoteForm.controls.printerFormControl.value != null) {
        this.selectedPrinter = this.printers?.[Number(this.quoteForm.controls.printerFormControl.value)];
      }

      this.filaments = this.filamentsService.getCompatibleFilamentsForAPrinter(<Printer>this.selectedPrinter)

      //called to trigger form value change event
      this.quoteForm.updateValueAndValidity()
    }
  }

  calculateQuote(filament: Filament, printer: Printer) {
    // calculate preparation time
    const modelPreparation: number = Number(this.quoteForm.controls['modelPreparationFormControl']?.value)
    const slicing: number = Number(this.quoteForm.controls['slicingFormControl']?.value)
    const materialChange: number = Number(this.quoteForm.controls['materialChangeFormControl']?.value)
    const transferAndStart: number = Number(this.quoteForm.controls['transferAndStartFormControl']?.value)
    const additionalWork: number = Number(this.quoteForm.controls['additionalWorkFormControl']?.value)

    const preparationTime = modelPreparation + slicing + materialChange + transferAndStart + additionalWork;
    this.quoteForm.controls['preparationTimeTotalFormControl'].setValue("" + preparationTime, {emitEvent: false});

    const weight: number = Number(this.quoteForm.controls['printWeightFormControl']?.value);
    const time: number = Number(this.quoteForm.controls['printTimeHoursFormControl']?.value)

    const quoteRequest= new QuoteRequest(filament, printer);
    quoteRequest.preparationTime = preparationTime;
    quoteRequest.filamentWeight = weight;
    quoteRequest.printingTime = time;
    quoteRequest.energyCost = Number(this.quoteForm.controls['energyCostFormControl']?.value);
    quoteRequest.laborCost = Number(this.quoteForm.controls['laborCostFormControl']?.value)
    quoteRequest.consumablesCost = Number(this.quoteForm.controls['consumablesFormControl'].value)
    quoteRequest.markupPercentage = Number(this.quoteForm.controls['markupCostSummaryFormControl'].value);

    //call quoting service
    const quoteResponse = this.quoteService.calculateQuote(quoteRequest);

    //display data in form
    this.quoteForm.controls['filamentCostSummaryFormControl'].setValue("" + quoteResponse.filamentPrice.toFixed(2), {emitEvent: false});
    this.quoteForm.controls['electricityCostSummaryFormControl'].setValue("" + quoteResponse.electricityCost.toFixed(2), {emitEvent: false});
    this.quoteForm.controls['printerDeprecationCostSummaryFormControl'].setValue("" + quoteResponse.deprecationCost.toFixed(2), {emitEvent: false});
    this.quoteForm.controls['preparationCostSummaryFormControl'].setValue("" + quoteResponse.preparationCost.toFixed(2), {emitEvent: false});
    this.quoteForm.controls['subtotalCostSummaryFormControl'].setValue(quoteResponse.subTotal.toFixed(2), {emitEvent: false})
    this.quoteForm.controls['subtotalWithFailuresCostSummaryFormControl'].setValue(quoteResponse.subTotalWithFailures.toFixed(2), {emitEvent: false})
    this.quoteForm.controls['consumablesCostSummaryFormControl'].setValue(quoteRequest.consumablesCost.toFixed(2), {emitEvent: false})
    this.quoteForm.controls['suggestedPriceCostSummaryFormControl'].setValue(quoteResponse.suggestedPrice.toFixed(2), {emitEvent: false})

    // calculate cost percentage to display in graph
    const filamentPercentage: number = (quoteResponse.filamentPrice * 100) / quoteResponse.subTotal;
    const electricityPercentageNumber: number = (Number(this.quoteForm.controls['electricityCostSummaryFormControl'].value) * 100) / quoteResponse.subTotal;
    const preparationPercentageNumber: number = (Number(this.quoteForm.controls['preparationCostSummaryFormControl'].value) * 100) / quoteResponse.subTotal;
    const consumablesPercentageNumber: number = (Number(this.quoteForm.controls['consumablesCostSummaryFormControl'].value) * 100) / quoteResponse.subTotal;
    const depreciationPercentageNumber: number = (Number(this.quoteForm.controls['printerDeprecationCostSummaryFormControl'].value) * 100) / quoteResponse.subTotal;

    //display data to graph
    this.saleData = [
      { name: "Filament", value: Number(filamentPercentage.toFixed(2)) },
      { name: "Electricity", value: Number(electricityPercentageNumber.toFixed(2)) },
      { name: "Preparation", value: Number(preparationPercentageNumber.toFixed(2)) },
      { name: "Consumables", value: Number(consumablesPercentageNumber.toFixed(2)) },
      { name: "Printer depreciation", value: Number(depreciationPercentageNumber.toFixed(2)) },
    ];
  }

  labelFormatting(name: string) { // this symbol will contain the symbol you defined in chartData[]
    let self: any = this; // this "this" will refer to the chart component (pun intented :))

    let data = self.series.filter((x: { name: string; }) => x.name == name); // chartData will be present in
    // series along with the label

    if(data.length > 0) {
      return `${data[0].name}: ${data[0].value} %`;
    } else {
      return name;
    }
  }

  onCurrencySelected(value: string) {
    if(this.currencies) {
      for(const currency of this.currencies) {
        if(currency.code === value) {
          this.selectedCurrency = currency;
          break;
        }
      }
      if (this.selectedCurrency) {
        this.currencyService.setCurrency(this.selectedCurrency)
      }
    }
  }

  onPrinterSelected(value: number) {
    if(value != null  && this.printers) {
      this.selectedPrinter = this.printers[value];

      this.filaments = this.filamentsService.getCompatibleFilamentsForAPrinter(this.selectedPrinter)
    } else {
      //clear selected printer and filaments if users unselects a printer
      this.selectedPrinter = undefined;
      this.filaments = [];
    }
  }

  resetForm() {
    //specify default value for disabled fields
    this.quoteForm.reset({
      preparationTimeTotalFormControl: "0",
      filamentCostSummaryFormControl: "0",
      electricityCostSummaryFormControl: "0",
      preparationCostSummaryFormControl: "0",
      printerDeprecationCostSummaryFormControl: "0",
      consumablesCostSummaryFormControl: "0",
      subtotalCostSummaryFormControl: "0",
      subtotalWithFailuresCostSummaryFormControl: "0",
      suggestedPriceCostSummaryFormControl: "0",
      markupCostSummaryFormControl: "100",
    });
    this.localService.removeItem("form")
    this.selectedCurrency = this.currencyService.getDefaultCurrency();
    //set currency from cache
    this.quoteForm.get("currencyFormControl")?.setValue(this.selectedCurrency.code, {emitEvent: false})
  }

  createNewCustomer(value: string | null) {

  }
}
