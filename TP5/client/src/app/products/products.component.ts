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

  public selectedCriteria = 'price-asc';
  public criterias = [{
      name: 'Prix (bas-haut)',
      key: 'price-asc',
    },
    {
      name: 'Prix (haut-bas)',
      key: 'price-dsc',
    },
    {
      name: 'Nom (A-Z)',
      key: 'alpha-asc',
    },
    {
      name: 'Nom (Z-A)',
      key: 'alpha-dsc',
  }]
  public selectedCategory = 'all';
  public categories = [{
      name: 'Appareils photo',
      key: 'cameras',
    },
    {
      name: 'Consoles',
      key: 'consoles',
    },
    {
      name: 'Écrans',
      key: 'screens',
    },
    {
      name: 'Ordinateurs',
      key: 'computers',
    },
    {
      name: 'Tous les produits',
      key: 'all'
  }]
  public products;
  public loading;

  constructor(public productsService: ProductsService){}

  ngOnInit() {
    this.loading = true;
    this.productsService.getProducts(this.selectedCriteria, this.selectedCategory).then((products) => {
      this.products = products;
      this.loading = false;
    })
  }

  public refreshProducts = async () => {
    this.products = await this.productsService.getProducts(this.selectedCriteria, this.selectedCategory);
  }

  public getCategory = (event) => {
    this.selectedCategory = event.target.value;
    this.refreshProducts();
  };

  public getCriteria = (event) => {
    this.selectedCriteria = event.target.value;
    this.refreshProducts();
  }


}
