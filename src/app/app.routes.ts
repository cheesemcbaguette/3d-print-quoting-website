import {Routes} from '@angular/router';
import {NewQuotePageComponent} from "./pages/new-quote-page/new-quote-page.component";
import {PrinterPageComponent} from "./pages/printer-page/printer-page.component";
import {FilamentPageComponent} from "./pages/filament-page/filament-page.component";
import {AboutPageComponent} from "./pages/about-page/about-page.component";
import {MyQuotesPageComponent} from "./pages/my-quotes-page/my-quotes-page.component";
import {CustomersComponent} from "./pages/customers/customers.component";
import {SettingsComponent} from "./pages/settings/settings.component";

export const routes: Routes  = [
  { path: '', redirectTo: '/my-quotes', pathMatch: 'full' },
  {path: 'my-quotes', component: MyQuotesPageComponent},
  {path: 'new-quote', component: NewQuotePageComponent},
  {path: 'customers', component: CustomersComponent},
  {path: 'printers', component: PrinterPageComponent},
  {path: 'filaments', component: FilamentPageComponent},
  {path: 'settings', component: SettingsComponent},
  {path: 'about', component: AboutPageComponent},
];

