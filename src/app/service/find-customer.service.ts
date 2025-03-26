import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FindCustomerService {
  private mockData: string[] = ['Joe, joe.mama@gmail.com', 'Brian', 'Obama', 'Date', 'Grape', 'Lemon'];

  constructor() { }

  search(query: string): Observable<string[]> {
    if (!query) {
      return of([]);
    }

    return of(this.mockData).pipe(
      map(data => data.filter(item => item.toLowerCase().includes(query.toLowerCase())))
    );
  }
}
