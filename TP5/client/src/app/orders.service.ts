import { Injectable } from '@angular/core';
import { Product } from './products.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Config } from './config';
import { Subject } from 'rxjs';

export class Order {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  products: Array<{id: number, quantity: number}>;
}

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  public orderInfo: {name: string, id: number};


  /**
   * Handles the current error.
   *
   * @param error                   The error to handle.
   * @return {Promise<object>}      A promise object.
   */
  private static handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.feedbackMessage || error);
  }
  private ordersUrl: string = `${Config.apiUrl}/orders/`;
  private options = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true
  };

  constructor(public http: HttpClient) { }

  public sendOrder = (order: Order): Promise<boolean> => {
    return this.http.post(this.ordersUrl, order, this.options)
    .toPromise()
    .then((bool) => {
      this.orderInfo = {
        id: order.id,
        name: `${order.firstName} ${order.lastName}`
      };
      if(bool === null) bool = true;
      return bool as boolean
    })
  }

  public getNewId = (): Promise<number> => {
    return this.http.get(this.ordersUrl, this.options)
    .toPromise()
    .then((orders: Order[]) => orders.length+1)
  }

}
