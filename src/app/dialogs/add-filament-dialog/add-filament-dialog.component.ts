import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MyErrorStateMatcher} from "../../utils/MyErrorStateMatcher";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Printer} from "../../model/printer";

@Component({
  selector: 'app-add-filament-dialog',
  templateUrl: './add-filament-dialog.component.html',
  styleUrls: ['./add-filament-dialog.component.scss']
})
export class AddFilamentDialogComponent implements OnInit {

  /*Form validations*/
  addFilamentForm = new FormGroup({
    nameFormControl: new FormControl('', [Validators.required,]),
    filamentDiameterFormControl: new FormControl('', [Validators.required,]),
    priceFormControl: new FormControl('', [Validators.required,]),
    depreciationTimeFormControl: new FormControl('', [Validators.required,]),
    serviceCostPerLifeFormControl: new FormControl('', [Validators.required,]),
    energyConsumptionFormControl: new FormControl('', [Validators.required,]),
  });

  matcher = new MyErrorStateMatcher();

  constructor(public dialogRef: MatDialogRef<AddFilamentDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: {currency: string}) {

  }

  ngOnInit(): void {
  }

  addFilament(): void {
    const name: string = this.addFilamentForm.get('nameFormControl')!.value!;
    const price = Number(this.addFilamentForm.get('priceFormControl')?.value);
    const serviceCost = Number(this.addFilamentForm.get('serviceCostPerLifeFormControl')?.value);
    const depreciationTime = Number(this.addFilamentForm.get('depreciationTimeFormControl')?.value);
    const filamentDiameter = Number(this.addFilamentForm.get('filamentDiameterFormControl')?.value);
    const energyConsumption = Number(this.addFilamentForm.get('energyConsumptionFormControl')?.value);
    const depreciation = (price + serviceCost) / depreciationTime;

    let newPrinter : Printer = {name: name, materialDiameter: filamentDiameter, price: price, depreciationTime: depreciationTime, serviceCostPerLife: serviceCost, energyConsumption, depreciation};

    this.dialogRef.close(newPrinter);
  }
}
