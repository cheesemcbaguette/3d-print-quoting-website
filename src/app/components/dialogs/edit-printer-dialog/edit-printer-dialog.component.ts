import {Component, Inject} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MyErrorStateMatcher} from "../../../utils/MyErrorStateMatcher";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Printer} from "../../../model/printer";
import {CurrencyService} from "../../../service/currency.service";
import {Currency} from "../../../model/currency";

@Component({
  selector: 'app-edit-printer-dialog',
  templateUrl: './edit-printer-dialog.component.html',
  styleUrls: ['./edit-printer-dialog.component.scss']
})
export class EditPrinterDialogComponent {

  /*Form validations*/
  editPrinterForm = new FormGroup({
    nameFormControl: new FormControl(this.data.printer.name, [Validators.required,]),
    filamentDiameterFormControl: new FormControl(this.data.printer.materialDiameter, [Validators.required,]),
    priceFormControl: new FormControl(this.data.printer.price, [Validators.required,]),
    depreciationTimeFormControl: new FormControl(this.data.printer.depreciationTime, [Validators.required,]),
    serviceCostPerLifeFormControl: new FormControl(this.data.printer.serviceCostPerLife, [Validators.required,]),
    energyConsumptionFormControl: new FormControl(this.data.printer.energyConsumption, [Validators.required,]),
  });

  matcher = new MyErrorStateMatcher();
  selectedCurrency: Currency;

  constructor(public dialogRef: MatDialogRef<EditPrinterDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: {printer : Printer}, private currencyService: CurrencyService) {
    this.selectedCurrency = currencyService.getCurrency();
  }

  editPrinter(): void {
    const name: string = this.editPrinterForm.get('nameFormControl')!.value!;
    const price = Number(this.editPrinterForm.get('priceFormControl')?.value);
    const serviceCost = Number(this.editPrinterForm.get('serviceCostPerLifeFormControl')?.value);
    const depreciationTime = Number(this.editPrinterForm.get('depreciationTimeFormControl')?.value);
    const filamentDiameter = Number(this.editPrinterForm.get('filamentDiameterFormControl')?.value);
    const energyConsumption = Number(this.editPrinterForm.get('energyConsumptionFormControl')?.value);
    const depreciation = (price + serviceCost) / depreciationTime;

    let newPrinter : Printer = {name: name, materialDiameter: filamentDiameter, price: price, depreciationTime: depreciationTime, serviceCostPerLife: serviceCost, energyConsumption, depreciation};

    this.dialogRef.close(newPrinter);
  }

}
