import { Component, ViewChild } from '@angular/core';
import { ProductsService } from '../products.service';

/**
 * Defines the component responsible to manage the display of the products page.
 */
@Component({
  selector: 'products',
  templateUrl: './products.component.html'
})
export class ProductsComponent {

  public criteria = 'price-asc';
  public category = 'all';
  public products;
  public loading;

  constructor(public productsService: ProductsService){

    const refreshProducts = async () => {
      this.products = await this.productsService.getProducts(this.criteria, this.category);
    }

    const getCategory = async (category: string) => {
      this.category = category;
      refreshProducts();
    };

    const getCriteria = async (criteria: string) => {
      this.criteria = criteria;
      refreshProducts();
    }
  }

  ngOnInit() { 
    this.loading = true;
    this.productsService.getProducts(this.criteria, this.category).then((products) => {
      this.products = products;
      this.loading = false;
    })
  }

}
