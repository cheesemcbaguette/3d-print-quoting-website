import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Customer } from '../model/customer';

@Injectable({
  providedIn: 'root'
})
export class FindCustomerService {
  private mockData: Customer[] = [
    { id: 1, name: 'Joe Smith', email: 'joe.smith@gmail.com' },
    { id: 2, name: 'Brian Johnson', email: 'brian.j@example.com' },
    { id: 3, name: 'Sarah Williams', email: 'sarah.w@example.com' },
    { id: 4, name: 'Michael Brown', email: 'michael.b@example.com' },
    { id: 5, name: 'Emma Davis', email: 'emma.d@example.com' }
  ];

  constructor() { }

  search(query: string): Observable<Customer[]> {
    if (!query) {
      return of([]);
    }

    const searchTerm = query.toLowerCase();
    return of(this.mockData).pipe(
      map(data => data.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm) ||
        customer.email?.toLowerCase().includes(searchTerm)
      ))
    );
  }

  createCustomer(name: string): Observable<Customer> {
    const newCustomer: Customer = {
      id: this.mockData.length + 1,
      name: name,
    };
    this.mockData.push(newCustomer);
    return of(newCustomer);
  }
}
