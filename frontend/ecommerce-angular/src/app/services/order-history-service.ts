import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { OrderHistoryModel } from '../models/order-history';
import { GetOrderHistoryResponse } from './models/order-history-model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrderHistoryService {

  private orderUrl =  environment.eCommerceApiUrl +'/orderses';

  constructor(private http: HttpClient){

  }

  getOrderHistory(theEmail: string): Observable<OrderHistoryModel[]>{
    const orderHistoryUrl = `${this.orderUrl}/search/findByCustomerEmailOrderByDateCreatedDesc?email=${theEmail}`;
    return this.http.get<GetOrderHistoryResponse>(orderHistoryUrl).pipe(
      map(response => response._embedded.orderses)
    );
  }
}
