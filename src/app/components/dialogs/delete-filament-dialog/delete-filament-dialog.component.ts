import {Component, Inject} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";

@Component({
  selector: 'app-delete-filament-dialog',
  standalone: true,
    imports: [
        MatButton,
        MatDialogActions,
        MatDialogClose,
        MatDialogContent,
        MatDialogTitle
    ],
  templateUrl: './delete-filament-dialog.component.html',
  styleUrl: './delete-filament-dialog.component.scss'
})
export class DeleteFilamentDialogComponent {
  constructor(public dialogRef: MatDialogRef<DeleteFilamentDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: {filamentName: string}) {

  }

}
