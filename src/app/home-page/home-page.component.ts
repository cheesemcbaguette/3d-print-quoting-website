import {Component, ElementRef, EventEmitter, Injectable, OnInit, Output, ViewChild} from '@angular/core';
import {NgbCalendar, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct} from "@ng-bootstrap/ng-bootstrap";

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
  styleUrls: ['./home-page.component.css'],


  // NOTE: For this example we are only providing current component, but probably
  // NOTE: you will want to provide your main App Module
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class HomePageComponent implements OnInit {

  @ViewChild('currencySelect') currencySelect!: ElementRef;

  @Output() currencySelectedEvent = new EventEmitter<string>();

  saleData = [
    { name: "Preparation", value: 21.4 },
    { name: "Filament", value: 34.5 },
    { name: "Electricity", value: 2.3 },
    { name: "Printer depreciation", value: 23.8 },
    { name: "Post processing", value: 17.9 }
  ];

  activePanels = ["panel-1", "panel-2", "panel-3", "panel-4", "panel-5", "panel-6"];

  model: string | undefined;

  selectedCurrency = "€";

  labelClass = "col-sm-6 col-form-label"
  inputDivClass = "col-sm-6"

  constructor(private ngbCalendar: NgbCalendar, private dateAdapter: NgbDateAdapter<string>) {}

  ngOnInit(): void {
    this.currencySelectedEvent.emit(this.selectedCurrency)
  }

  get today() {
    return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
  }

  onCurrencySelected(): void {
    this.currencySelectedEvent.emit(this.selectedCurrency)
    console.log(this.selectedCurrency);
  }




  labelFormatting(name: string) { // this name will contain the name you defined in chartData[]
    let self: any = this; // this "this" will refer to the chart component (pun intented :))

    let data = self.series.filter((x: { name: string; }) => x.name == name); // chartData will be present in
    // series along with the label

    if(data.length > 0) {
      return `${data[0].name}: ${data[0].value} %`;
    } else {
      return name;
    }
  }
}
