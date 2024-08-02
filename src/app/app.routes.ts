import {Routes} from '@angular/router';
import {HomePageComponent} from "./pages/home-page/home-page.component";
import {PrinterPageComponent} from "./pages/printer-page/printer-page.component";
import {FilamentPageComponent} from "./pages/filament-page/filament-page.component";
import {AboutPageComponent} from "./pages/about-page/about-page.component";

export const routes: Routes  = [
  { path: '', component: HomePageComponent, },
  {path: 'home', component: HomePageComponent},
  {path: 'printers', component: PrinterPageComponent},
  {path: 'material', component: FilamentPageComponent},
  {path: 'about', component: AboutPageComponent},
];

