import {Printer} from "../app/model/printer";

export const PRINTERS: Printer[] = [
  {
    name: 'CR-10',
    materialDiameter: 1.75,
    price: 450,
    depreciationTime: 2000,
    serviceCostPerLife: 100,
    energyConsumption: 0.150,
    depreciation: 0.275
  },
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
    name: 'Ultimaker 3 Extended',
    materialDiameter: 2.85,
    price: 4400,
    depreciationTime: 4000,
    serviceCostPerLife: 250,
    energyConsumption: 0.110,
    depreciation: 1.163
  },
  {
    name: 'CR-6 SE',
    materialDiameter: 1.75,
    price: 330,
    depreciationTime: 2000,
    serviceCostPerLife: 100,
    energyConsumption: 0.150,
    depreciation: 0.215
  },
];
