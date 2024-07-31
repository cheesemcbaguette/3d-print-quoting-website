import {Injectable} from '@angular/core';
import {LocalService} from "./local.service";
import {Filament} from "../model/filament";
import {FILAMENTS} from "../../assets/filaments-data";
import {Printer} from "../model/printer";

@Injectable({
  providedIn: 'root'
})
export class FilamentsService {

  private filaments: Filament[] = [];
  private localStorageKey = "filament"

  constructor(private localService: LocalService) {
    const json = this.localService.getItem(this.localStorageKey)


    if(json != null) {
      const localFilaments: Filament[] = JSON.parse(<string>this.localService.getItem(this.localStorageKey));
      if(localFilaments.length > 0) {
        this.filaments = localFilaments;
      } else {
        this.filaments = FILAMENTS;
      }

    } else {
      this.filaments = FILAMENTS;
    }
  }

  getAllFilaments(): Filament[] {
    return this.filaments;
  }

  getCompatibleFilamentsForAPrinter(printer: Printer): Filament[] {
    const compatibleFilaments: Filament[] = [];

    this.filaments.forEach(function (filament) {
      if(printer.materialDiameter == filament.materialDiameter) {
        //append filament to the compatible list if it matches the printer diameter
        compatibleFilaments.push(filament)
      }
    })

    return compatibleFilaments;
  }

  editFilaments(filaments: Filament[]): void {
    this.filaments = filaments;
    // Store the object into storage
    this.localService.setItem(this.localStorageKey, JSON.stringify(this.filaments));
  }
}
