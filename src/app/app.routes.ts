import {RouterModule, Routes} from '@angular/router';
import {HomePageComponent} from "./home-page/home-page.component";
import {PrinterPageComponent} from "./printer-page/printer-page.component";
import {FilamentPageComponent} from "./filament-page/filament-page.component";
import {AboutPageComponent} from "./about-page/about-page.component";
import {NgModule} from "@angular/core";

export const routes: Routes  = [
  { path: '', component: HomePageComponent, },
  {path: 'home', component: HomePageComponent},
  {path: 'printers', component: PrinterPageComponent},
  {path: 'material', component: FilamentPageComponent},
  {path: 'about', component: AboutPageComponent},
];

