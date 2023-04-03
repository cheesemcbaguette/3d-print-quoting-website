import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MyErrorStateMatcher} from "../../utils/MyErrorStateMatcher";

@Component({
  selector: 'app-add-printer-dialog',
  templateUrl: './add-printer-dialog.component.html',
  styleUrls: ['./add-printer-dialog.component.css']
})
export class AddPrinterDialogComponent implements OnInit {

  selectedCurrency: string | undefined;

  /*Form validations*/
  addPrinterForm = new FormGroup({
    nameFormControl: new FormControl('', [Validators.required,]),
    filamentDiameterFormControl: new FormControl('', [Validators.required,]),
    priceFormControl: new FormControl('', [Validators.required,]),
    depreciationTimeFormControl: new FormControl('', [Validators.required,]),
    serviceCostPerLifeFormControl: new FormControl('', [Validators.required,]),
    energyConsumptionFormControl: new FormControl('', [Validators.required,]),
  });

  matcher = new MyErrorStateMatcher();

  constructor(public dialogRef: MatDialogRef<AddPrinterDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: {currency: string}) {
    this.selectedCurrency = data.currency;
  }

  ngOnInit(): void {
  }

  addPrinter(): void {
    this.dialogRef.close();
  }
}
