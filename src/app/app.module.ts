import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {MatTabsModule} from "@angular/material/tabs";
import { NgxChartsModule } from '@swimlane/ngx-charts';
import {MatGridListModule} from "@angular/material/grid-list";
import {MatError, MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule, MatOptionModule} from '@angular/material/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { NewQuotePageComponent } from './pages/new-quote-page/new-quote-page.component';
import {FilamentPageComponent} from './pages/filament-page/filament-page.component';
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {PrinterPageComponent} from "./pages/printer-page/printer-page.component";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {MatListModule} from "@angular/material/list";
import {RouterLinkWithHref, RouterModule, RouterOutlet} from "@angular/router";
import {MatMenuModule} from "@angular/material/menu";
import { AddPrinterDialogComponent } from './components/dialogs/add-printer-dialog/add-printer-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatSelectModule} from "@angular/material/select";
import { DeletePrinterDialogComponent } from './components/dialogs/delete-printer-dialog/delete-printer-dialog.component';
import { AddFilamentDialogComponent } from './components/dialogs/add-filament-dialog/add-filament-dialog.component';
import {MatTimepickerModule, provideNativeDateTimeAdapter} from "@dhutaryan/ngx-mat-timepicker";

import { routes } from './app.routes';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelDescription, MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from "@angular/material/expansion";
import {AboutPageComponent} from "./pages/about-page/about-page.component";
import {MatIconButtonSizesModule} from "mat-icon-button-sizes";
import {MatTooltip} from "@angular/material/tooltip";
import {MyQuotesPageComponent} from "./pages/my-quotes-page/my-quotes-page.component";
import {CustomersComponent} from "./pages/customers/customers.component";
import {SettingsComponent} from "./pages/settings/settings.component";

@NgModule({
  declarations: [
    AppComponent,
    NewQuotePageComponent,
    PrinterPageComponent,
    FilamentPageComponent,
    AddPrinterDialogComponent,
    DeletePrinterDialogComponent,
    AddFilamentDialogComponent,
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
    MatSelectModule,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelTitle,
    MatExpansionPanelDescription,
    MatExpansionPanelHeader,
    AboutPageComponent,
    RouterOutlet,
    RouterModule.forRoot(routes),
    MatIconButtonSizesModule,
    MatTimepickerModule,
    MatError,
    MatIcon,
    MatTooltip,
    MyQuotesPageComponent,
    CustomersComponent,
    SettingsComponent
  ],
  providers: [provideNativeDateTimeAdapter()],
  bootstrap: [AppComponent]
})
export class AppModule { }
