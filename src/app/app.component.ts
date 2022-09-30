import { Component } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'printing-quoting-sheet';

  saleData = [
    { name: "Preparation", value: 21.4 },
    { name: "Filament", value: 34.5 },
    { name: "Electricity", value: 2.3 },
    { name: "Printer depreciation", value: 23.8 },
    { name: "Post processing", value: 17.9 }
  ];

  labelFormatting(name: string) { // this name will contain the name you defined in chartData[]
    let self: any = this; // this "this" will refer to the chart component (pun intented :))

    let data = self.series.filter((x: { name: string; }) => x.name == name); // chartData will be present in
                                                        // series along with the label

    if(data.length > 0) {
      return `${data[0].name}: ${data[0].value} %`;
    } else {
      return name;
    }
  }
}
