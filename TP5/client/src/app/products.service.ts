import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Config } from './config';

/**
 * Defines a product.
 */
export class Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  features: string[];
}

/**
 * Defines the service responsible to retrieve the products in the database.
 */
@Injectable()
export class ProductsService {

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

  /**
   * Initializes a new instance of the ProductsService class.
   *
   * @param http                    The HTTP service to use.
   */
  constructor(private http: HttpClient) { }

  /**
   * Gets all the products in the database.
   *
   * @param [sortingCriteria]       The sorting criteria to use. If no value is specified, the list returned isn't sorted.
   * @param [category]              The category of the product. The default value is "all".
   * @return {Promise<Product[]>}   The category of the product. The default value is "all".
   */
  getProducts(sortingCriteria?: string, category?: string): Promise<Product[]> {
    const url = `${Config.apiUrl}/products`;
    let params = new HttpParams();
    if (category && category !== 'all') {
      params = params.append('category', category);
    }
    if (sortingCriteria) {
      params = params.append('criteria', sortingCriteria);
    }
    return this.http.get(url, {params: params})
      .toPromise()
      .then(products => products as Product[])
      .catch(ProductsService.handleError);
  }

  /**
   * Gets the product associated with the product ID specified.
   *
   * @param productId               The product ID associated with the product to retrieve.
   * @returns {Promise<Product>}    A promise that contains the product associated with the ID specified.
   */
  getProduct(productId: number): Promise<Product> {
    const url = `${Config.apiUrl}/products/${productId}`;
    return this.http.get(url)
      .toPromise()
      .then(product => product as Product)
      .catch(() => null);
  }
}
