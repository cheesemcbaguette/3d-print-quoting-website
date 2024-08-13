import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MyErrorStateMatcher} from "../../../utils/MyErrorStateMatcher";
import {Printer} from "../../../model/printer";
import {CurrencyService} from "../../../service/currency.service";
import {Currency} from "../../../model/currency";

@Component({
  selector: 'app-add-printer-dialog',
  templateUrl: './add-printer-dialog.component.html',
  styleUrls: ['./add-printer-dialog.component.css']
})
export class AddPrinterDialogComponent implements OnInit {

  /*Form validations*/
  addPrinterForm = new FormGroup({
    nameFormControl: new FormControl(this.data.printer ? this.data.printer.name : "", [Validators.required,]),
    filamentDiameterFormControl: new FormControl(this.data.printer ? this.data.printer.materialDiameter : "", [Validators.required,]),
    priceFormControl: new FormControl(this.data.printer ? this.data.printer.price : "", [Validators.required,]),
    depreciationTimeFormControl: new FormControl(this.data.printer ? this.data.printer.depreciationTime : "", [Validators.required,]),
    serviceCostPerLifeFormControl: new FormControl(this.data.printer ? this.data.printer.serviceCostPerLife : "", [Validators.required,]),
    energyConsumptionFormControl: new FormControl(this.data.printer ? this.data.printer.energyConsumption : "", [Validators.required,]),
  });

  matcher = new MyErrorStateMatcher();
  selectedCurrency: Currency;

  constructor(public dialogRef: MatDialogRef<AddPrinterDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: {printer : Printer, title: string}, private currencyService: CurrencyService) {
    this.selectedCurrency = currencyService.getCurrency();
  }

  ngOnInit(): void {
  }

  addPrinter(): void {
    const name: string = this.addPrinterForm.get('nameFormControl')!.value!;
    const price = Number(this.addPrinterForm.get('priceFormControl')?.value);
    const serviceCost = Number(this.addPrinterForm.get('serviceCostPerLifeFormControl')?.value);
    const depreciationTime = Number(this.addPrinterForm.get('depreciationTimeFormControl')?.value);
    const filamentDiameter = Number(this.addPrinterForm.get('filamentDiameterFormControl')?.value);
    const energyConsumption = Number(this.addPrinterForm.get('energyConsumptionFormControl')?.value);
    const depreciation = (price + serviceCost) / depreciationTime;

    let newPrinter : Printer = {name: name, materialDiameter: filamentDiameter, price: price, depreciationTime: depreciationTime, serviceCostPerLife: serviceCost, energyConsumption, depreciation};

    this.dialogRef.close(newPrinter);
  }
}
