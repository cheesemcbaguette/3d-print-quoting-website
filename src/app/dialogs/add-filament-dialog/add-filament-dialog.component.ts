import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MyErrorStateMatcher} from "../../utils/MyErrorStateMatcher";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Printer} from "../../model/printer";
import {Filament} from "../../model/filament";

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
    filamentWeightFormControl: new FormControl('', [Validators.required,]),
    densityFormControl: new FormControl('', [Validators.required,]),
    nozzleTempFormControl: new FormControl('', []),
    bedTempFormControl: new FormControl('', []),
  });

  matcher = new MyErrorStateMatcher();

  constructor(public dialogRef: MatDialogRef<AddFilamentDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: {currency: string}) {

  }

  ngOnInit(): void {
  }

  addFilament(): void {
    const name: string = this.addFilamentForm.get('nameFormControl')!.value!;
    const filamentDiameter = Number(this.addFilamentForm.get('filamentDiameterFormControl')?.value);
    const price = Number(this.addFilamentForm.get('priceFormControl')?.value);
    const filamentWeight = Number(this.addFilamentForm.get('filamentWeightFormControl')?.value);
    const density = Number(this.addFilamentForm.get('densityFormControl')?.value);
    const nozzleTemp = Number(this.addFilamentForm.get('nozzleTempFormControl')?.value);
    const bedTemp = Number(this.addFilamentForm.get('bedTempFormControl')?.value);

    let newFilament : Filament = {name: name, materialDiameter: filamentDiameter, spoolPrice: price, filamentWeight: filamentWeight, density: density, nozzleTemp: nozzleTemp, bedTemp: bedTemp};

    this.dialogRef.close(newFilament);
  }
}
