import {AfterViewInit, Component, ElementRef, Injectable, ViewChild} from '@angular/core';
import {NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct} from "@ng-bootstrap/ng-bootstrap";
import {Printer} from "../../model/printer";
import {PrintersService} from "../../service/printers.service";
import {CurrencyService} from "../../service/currency.service";
import {FilamentsService} from "../../service/filaments.service";
import {Filament} from "../../model/filament";
import {FormControl, FormGroup, Validators, ɵFormGroupRawValue} from "@angular/forms";
import {LocalService} from "../../service/local.service";
import {Currency} from "../../model/currency";
import {CURRENCIES} from "../../../assets/currencies-data";


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

  printers: Printer[] | undefined;
  filaments: Filament[] | undefined;
  currencies: Currency[] = CURRENCIES;

  saleData = [
    { name: "Preparation", value: 21.4 },
    { name: "Filament", value: 34.5 },
    { name: "Electricity", value: 2.3 },
    { name: "Printer depreciation", value: 23.8 },
    { name: "Post processing", value: 17.9 }
  ];

  model: string | undefined;

  selectedCurrency : Currency | undefined;
  selectedPrinter: Printer | undefined;

  labelClass = "col-sm-6 col-form-label"
  inputDivClass = "col-sm-6"

  /*Form validations*/
  quoteForm = new FormGroup({
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
    clientDemandingFormControl: new FormControl("", []),

    filamentCostSummaryFormControl: new FormControl({value: "0", disabled: true}),
    electricityCostSummaryFormControl: new FormControl({value: "0", disabled: true}),
  });


  constructor(private printersService: PrintersService, private currencyService: CurrencyService, public filamentsService: FilamentsService, public localService: LocalService) {
  }

  ngAfterViewInit(): void {
    this.printers = this.printersService.getPrinters();
    this.selectedCurrency = this.currencyService.getCurrency();
    //set currency from cache
    this.quoteForm.get("currencyFormControl")?.setValue(this.selectedCurrency.code, {emitEvent: false})

    //get form from cache
    const localForm = this.localService.getItem("form");
    if(localForm) {
      this.quoteForm.patchValue(JSON.parse(localForm))
      //TODO manually store and load form data from cache
    }

    //calculate quote on code change if the form is valid
    this.quoteForm.valueChanges.subscribe(value => {
      //save form to cache
      this.localService.setItem("form", JSON.stringify(this.quoteForm.value))

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
        this.quoteForm.controls['filamentCostSummaryFormControl'].setValue("" + filamentPrice, {emitEvent: false});

        //calculate electricity cost
        if(this.quoteForm.controls['energyCostFormControl'].value) {
          const energyCost: number = Number(this.quoteForm.controls['energyCostFormControl']?.value)
          const time: number = Number(this.quoteForm.controls['printTimeHoursFormControl']?.value)

          const electricityUsed: number = printer.energyConsumption * energyCost * time;

          this.quoteForm.controls['electricityCostSummaryFormControl'].setValue("" + electricityUsed, {emitEvent: false});
        }
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

  onPrinterSelected(value: string) {
    if(value && this.printers) {
      this.selectedPrinter = this.printers[parseInt(value)];

      this.filaments = this.filamentsService.getCompatibleFilamentsForAPrinter(this.selectedPrinter)
    } else {
      //clear selected printer and filaments if users unselects a printer
      this.selectedPrinter = undefined;
      this.filaments = [];
    }
  }

  resetForm() {
    this.quoteForm.reset();
  }
}
