import {AfterViewInit, Component, ElementRef, Injectable, TemplateRef, ViewChild} from '@angular/core';
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
import {QuoteRequest} from "../../model/quote-request";
import {QuoteService} from "../../service/quote.service";
import {distinctUntilChanged, Observable, of, switchMap} from "rxjs";
import {FindCustomerService} from "../../service/find-customer.service";
import {map} from "rxjs/operators";
import {Customer} from "../../model/customer";
import {MatDialog} from "@angular/material/dialog";


@Component({
  selector: 'new-quote-page',
  templateUrl: './new-quote-page.component.html',
  styleUrls: ['./new-quote-page.component.scss'],
})
export class NewQuotePageComponent implements AfterViewInit  {

  customers$: Observable<Customer[]>;
  selectedCustomer: Customer | null = null;

  @ViewChild('filamentSelect') filamentSelect!: ElementRef;
  @ViewChild('costBreakdownDialog') costBreakdownDialog!: TemplateRef<any>;

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

    consumablesFormControl: new FormControl("", []),
    failureRateFormControl: new FormControl("", []),

    filamentCostSummaryFormControl: new FormControl({value: "0", disabled: true}),
    electricityCostSummaryFormControl: new FormControl({value: "0", disabled: true}),
    printerDeprecationCostSummaryFormControl: new FormControl({value: "0", disabled: true}),
    preparationCostSummaryFormControl: new FormControl({value: "0", disabled: true}),
    consumablesCostSummaryFormControl: new FormControl({value: "0", disabled: true}),
    subtotalCostSummaryFormControl: new FormControl({value: "0", disabled: true}),
    subtotalWithFailuresCostSummaryFormControl: new FormControl({value: "0", disabled: true}),
    markupCostSummaryFormControl: new FormControl("0", []),
    suggestedPriceCostSummaryFormControl: new FormControl({value: "0", disabled: true}),
  });

  constructor(private printersService: PrintersService, private currencyService: CurrencyService,
              public filamentsService: FilamentsService, public localService: LocalService,
              public quoteService: QuoteService, private findCustomerService: FindCustomerService,
              private dialog: MatDialog) {

    this.customers$ = this.quoteForm.controls.nameFormControl.valueChanges.pipe(
      // Prevents duplicate consecutive values from being emitted
      distinctUntilChanged(),
      // Handle both string and Customer object values
      map((value: string | Customer | null) => {
        if (typeof value === 'string') {
          return value.trim();
        }
        return value?.name || '';
      }),
      // Only performs search if we have input text, otherwise returns empty array
      switchMap(value => value.length > 0 ? this.findCustomerService.search(value) : of([])),
      // Ensures we always have an array, even if the service returns null/undefined
      map(customers => customers || [])
    );
  }

  ngAfterViewInit(): void {
    this.printers = this.printersService.getPrinters();
    this.selectedCurrency = this.currencyService.getCurrency();

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

    const weight: number = Number(this.quoteForm.controls['printWeightFormControl']?.value);
    const time: number = Number(this.quoteForm.controls['printTimeHoursFormControl']?.value)

    const quoteRequest= new QuoteRequest(filament, printer);
    quoteRequest.preparationTime = preparationTime;
    quoteRequest.filamentWeight = weight;
    quoteRequest.printingTime = time;
    quoteRequest.energyCost = 0.20;
    quoteRequest.laborCost = 25;
    quoteRequest.failureRate = Number(this.quoteForm.controls['failureRateFormControl'].value)
    quoteRequest.consumablesCost = Number(this.quoteForm.controls['consumablesFormControl'].value);
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

  createNewCustomer(value: string | null) {
    if (!value) return;
    const trimmedValue = value.trim();
    if (!trimmedValue) return;

    this.findCustomerService.createCustomer(trimmedValue).subscribe(customer => {
      this.selectedCustomer = customer;
      this.quoteForm.patchValue({
        nameFormControl: customer.name
      });
    });
  }

  onCustomerSelected(customer: Customer) {
    this.selectedCustomer = customer;
  }

  displayCustomerFn(customer: Customer | string): string {
    if (typeof customer === 'string') {
      return customer;
    }
    return customer?.name || '';
  }

  openCostBreakdownDialog() {
    this.dialog.open(this.costBreakdownDialog, {
      width: '1500px',
      height: '550px'
    });
  }

  createQuote() {
    // This method is intentionally left empty as per requirements
  }
}
