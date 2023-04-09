import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {MatTabsModule} from "@angular/material/tabs";
import { NgxChartsModule } from '@swimlane/ngx-charts';
import {MatGridListModule} from "@angular/material/grid-list";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule, MatOptionModule} from '@angular/material/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { HomePageComponent } from './home-page/home-page.component';
import {FilamentPageComponent} from './filament-page/filament-page.component';
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {PrinterPageComponent} from "./printer-page/printer-page.component";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatIconModule} from "@angular/material/icon";
import {MatListModule} from "@angular/material/list";
import {RouterLinkWithHref} from "@angular/router";
import {MatMenuModule} from "@angular/material/menu";
import { AddPrinterDialogComponent } from './dialogs/add-printer-dialog/add-printer-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatSelectModule} from "@angular/material/select";
import { EditPrinterDialogComponent } from './dialogs/edit-printer-dialog/edit-printer-dialog.component';
import { DeletePrinterDialogComponent } from './dialogs/delete-printer-dialog/delete-printer-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    PrinterPageComponent,
    FilamentPageComponent,
    AddPrinterDialogComponent,
    EditPrinterDialogComponent,
    DeletePrinterDialogComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatTabsModule,
    NgxChartsModule,
    MatGridListModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgbModule,
    FormsModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    RouterLinkWithHref,
    MatMenuModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatOptionModule,
    MatSelectModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
