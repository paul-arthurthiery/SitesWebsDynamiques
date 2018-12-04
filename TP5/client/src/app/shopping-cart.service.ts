import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Config } from './config';
import { Product } from './products.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ShoppingCartService {

  private addToCount = new Subject<number>();

  public getAddToCount = (): Subject<number> => {
    return this.addToCount
  }

  private static handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.feedbackMessage || error);
  }

  private shoppingCartUrl: string = `${Config.apiUrl}/shopping-cart/`;
  private options = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true
  };

  constructor(private http: HttpClient) { }

  public getCart = (): Promise<Array<{productId: number, quantity: number}>> => {
    let url: string = this.shoppingCartUrl;
    return this.http.get(url, this.options)
    .toPromise()
    .then(cart => cart as Product[])
    .catch(ShoppingCartService.handleError)
  }

  public getItem = (productId: number): Promise<Product> => {
    let url: string = `${this.shoppingCartUrl}/${productId}`;
    return this.http.get(url, this.options)
    .toPromise()
    .then(product => product as Product)
    .catch(ShoppingCartService.handleError)
  }

  public addItem = (productId: number, quantity: number): Promise<void> => {
    let url: string = this.shoppingCartUrl;
    return this.http.post(url, JSON.stringify({
      productId,
      quantity,
    }), this.options)
    .toPromise()
    .then(() => this.addToCount.next(quantity))
    .catch(ShoppingCartService.handleError)
  }

  public updateQuantity = (productId: number, quantity: number): Promise<void> => {
    let url: string = `${this.shoppingCartUrl}/${productId}`;
    return this.http.put(url, JSON.stringify({
      quantity
    }), this.options)
    .toPromise()
    .then(() => this.addToCount.next(quantity))
    .catch((err) => {
      if(err.status === 404) {
        err.message = "Product not in cart";
        return err;
      } else {
        err.message = "Invalid product";
        return err;
      }
    })
  }

  public deleteProduct = (productId: number): Promise<void> => {
    let url: string = `${this.shoppingCartUrl}/${productId}`;
    return this.http.delete(url, this.options)
    .toPromise()
    .catch(ShoppingCartService.handleError)
  }

  public deleteAllProducts = (): Promise<void> => {
    let url: string = this.shoppingCartUrl;
    return this.http.delete(url, this.options)
    .toPromise()
    .then((stuff) => null);
  }

}
