import {Printer} from "../app/model/printer";

export const PRINTERS: Printer[] = [
  {
    name: 'Prusa i3 MK3s',
    materialDiameter: 1.75,
    price: 700,
    depreciationTime: 3000,
    serviceCostPerLife: 100,
    energyConsumption: 0.100,
    depreciation: 0.267
  },
  {
    name: 'Voron 2.4',
    materialDiameter: 1.75,
    price: 1500,
    depreciationTime: 3000,
    serviceCostPerLife: 100,
    energyConsumption: 0.110,
    depreciation: 0.26
  },
  {
    name: 'Bambulab X1C',
    materialDiameter: 1.75,
    price: 1500,
    depreciationTime: 3000,
    serviceCostPerLife: 150,
    energyConsumption: 0.150,
    depreciation: 0.215
  },
];
