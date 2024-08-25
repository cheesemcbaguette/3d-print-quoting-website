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
  selector: 'home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],

  // NOTE: For this example we are only providing current component, but probably
  // NOTE: you will want to provide your main App Module
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class HomePageComponent implements AfterViewInit  {

  @ViewChild('currencySelect') currencySelect!: ElementRef;

  @ViewChild('filamentSelect') filamentSelect!: ElementRef;

  @ViewChild('fileInput') fileInput!: ElementRef;

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
    markupCostSummaryFormControl: new FormControl("100", []),
    suggestedPriceCostSummaryFormControl: new FormControl({value: "0", disabled: true}),
  });


  constructor(private printersService: PrintersService, private currencyService: CurrencyService, public filamentsService: FilamentsService, public localService: LocalService) {
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

      // calculate preparation time
      const modelPreparation: number = Number(this.quoteForm.controls['modelPreparationFormControl']?.value)
      const slicing: number = Number(this.quoteForm.controls['slicingFormControl']?.value)
      const materialChange: number = Number(this.quoteForm.controls['materialChangeFormControl']?.value)
      const transferAndStart: number = Number(this.quoteForm.controls['transferAndStartFormControl']?.value)
      const additionalWork: number = Number(this.quoteForm.controls['additionalWorkFormControl']?.value)

      const preparationTime = modelPreparation + slicing + materialChange + transferAndStart + additionalWork;
      this.quoteForm.controls['preparationTimeTotalFormControl'].setValue("" + preparationTime, {emitEvent: false});

      if(this.quoteForm.valid && this.filaments && this.printers) {
        //calculate the cost of the filament
        const filament: Filament = this.filaments[Number(this.quoteForm.controls['filamentFormControl'].value)]
        const printer: Printer = this.printers[Number(this.quoteForm.controls['printerFormControl'].value)]
        const weight: number = Number(this.quoteForm.controls['printWeightFormControl']?.value);
        //divide weight by 1000 because weight is in grams and filamentWeight is in kg
        const filamentPrice: number = (weight / 1000) * (filament.spoolPrice / filament.filamentWeight);
        this.quoteForm.controls['filamentCostSummaryFormControl'].setValue("" + filamentPrice.toFixed(2), {emitEvent: false});
        const time: number = Number(this.quoteForm.controls['printTimeHoursFormControl']?.value)

        //calculate electricity cost
        if(this.quoteForm.controls['energyCostFormControl'].value) {
          const energyCost: number = Number(this.quoteForm.controls['energyCostFormControl']?.value)

          const electricityUsed: number = printer.energyConsumption * energyCost * time;

          this.quoteForm.controls['electricityCostSummaryFormControl'].setValue("" + electricityUsed.toFixed(2), {emitEvent: false});
        }

        // calculate deprecation cost
        const deprecationCost: number = printer.depreciation * time
        this.quoteForm.controls['printerDeprecationCostSummaryFormControl'].setValue("" + deprecationCost.toFixed(2), {emitEvent: false});

        //calculate preparation cost
        if(this.quoteForm.controls['preparationTimeTotalFormControl'].value && this.quoteForm.controls['laborCostFormControl'].value ) {
          const prepTime: number = Number(this.quoteForm.controls['preparationTimeTotalFormControl']?.value)
          const laborCost: number = Number(this.quoteForm.controls['laborCostFormControl']?.value)

          const prepCost: number = prepTime / 60 * laborCost;

          this.quoteForm.controls['preparationCostSummaryFormControl'].setValue("" + prepCost.toFixed(2), {emitEvent: false});
        }

        // calculate consumables cost
        if(this.quoteForm.controls['consumablesFormControl'].value) {
          this.quoteForm.controls['consumablesCostSummaryFormControl'].setValue(this.quoteForm.controls['consumablesFormControl'].value, {emitEvent: false})
        } else {
          this.quoteForm.controls['consumablesCostSummaryFormControl'].setValue("0", {emitEvent: false})
        }

        // calculate subtotal
        const subtotal = filamentPrice + Number(this.quoteForm.controls['electricityCostSummaryFormControl'].value)
          + deprecationCost + Number(this.quoteForm.controls['preparationCostSummaryFormControl'].value) + Number(this.quoteForm.controls['consumablesCostSummaryFormControl'].value)
        this.quoteForm.controls['subtotalCostSummaryFormControl'].setValue(subtotal.toFixed(2), {emitEvent: false})

        // calculate subtotal + failure rate % cost
        if(this.quoteForm.controls['failureRateFormControl'].value) {
          const subtotalWithFailures = subtotal * (Number(this.quoteForm.controls['failureRateFormControl'].value) / 100 + 1)
          this.quoteForm.controls['subtotalWithFailuresCostSummaryFormControl'].setValue(subtotalWithFailures.toFixed(2), {emitEvent: false})
        } else {
          this.quoteForm.controls['subtotalWithFailuresCostSummaryFormControl'].setValue(subtotal.toFixed(2), {emitEvent: false})
        }

        // calculate suggested price with markup
        if(this.quoteForm.controls['markupCostSummaryFormControl'].value && this.quoteForm.controls['markupCostSummaryFormControl'].value != "0") {
          const suggestedPrice = Number(this.quoteForm.controls['subtotalWithFailuresCostSummaryFormControl'].value) * (Number(this.quoteForm.controls['markupCostSummaryFormControl'].value) / 100);
          this.quoteForm.controls['suggestedPriceCostSummaryFormControl'].setValue(suggestedPrice.toFixed(2), {emitEvent: false})
        } else {
          this.quoteForm.controls['suggestedPriceCostSummaryFormControl'].setValue(this.quoteForm.controls['subtotalWithFailuresCostSummaryFormControl'].value, {emitEvent: false})
        }

        const filamentPercentage: number = (filamentPrice * 100) / subtotal;
        const electricityPercentageNumber: number = (Number(this.quoteForm.controls['electricityCostSummaryFormControl'].value) * 100) / subtotal;
        const preparationPercentageNumber: number = (Number(this.quoteForm.controls['preparationCostSummaryFormControl'].value) * 100) / subtotal;
        const consumablesPercentageNumber: number = (Number(this.quoteForm.controls['consumablesCostSummaryFormControl'].value) * 100) / subtotal;
        const depreciationPercentageNumber: number = (Number(this.quoteForm.controls['printerDeprecationCostSummaryFormControl'].value) * 100) / subtotal;

        //display data to graph
        this.saleData = [
          { name: "Filament", value: Number(filamentPercentage.toFixed(2)) },
          { name: "Electricity", value: Number(electricityPercentageNumber.toFixed(2)) },
          { name: "Preparation", value: Number(preparationPercentageNumber.toFixed(2)) },
          { name: "Consumables", value: Number(consumablesPercentageNumber.toFixed(2)) },
          { name: "Printer depreciation", value: Number(depreciationPercentageNumber.toFixed(2)) },
        ];
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

  exportForm() {
    const jsonString = JSON.stringify(this.quoteForm.value, null, 2); // Convert JSON object to string
    FileUtils.createAndDownloadFile(jsonString, "quote.json")
  }

  importForm(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => {
        try {
          const resultAsJson = reader.result as string
          const result = JSON.parse(resultAsJson)
          this.quoteForm.patchValue(result, {emitEvent: true})

          if (this.quoteForm.controls.printerFormControl.value != null) {
            this.selectedPrinter = this.printers?.[Number(this.quoteForm.controls.printerFormControl.value)];
          }

          this.filaments = this.filamentsService.getCompatibleFilamentsForAPrinter(<Printer>this.selectedPrinter)

          //called to trigger form value change event
          this.quoteForm.updateValueAndValidity()

          console.log('Quote imported'); // JSON data is now stored in the jsonData variable
        } catch (e) {
          console.error('Error parsing JSON', e);
        }
      };
    }
  }
}
