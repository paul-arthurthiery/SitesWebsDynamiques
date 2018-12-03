import { Component } from '@angular/core';
import { ProductsService, Product } from "../products.service"

/**
 * Defines the component responsible to manage the shopping cart page.
 */
@Component({
  selector: 'shopping-cart',
  templateUrl: './shopping-cart.component.html'
})
export class ShoppingCartComponent {

  public items: Product[];
  public loading: boolean;
  public cart: string[];
  public quantityArray: number[] = [];
  public total: number = 0;

  constructor(public productsService: ProductsService) {
    this.cart = JSON.parse(localStorage.getItem("panier"));
    this.cart.sort();
    this.cart.forEach((product, index) => {
      if(this.quantityArray[parseInt(product, 10)] > 0){
        this.quantityArray[parseInt(product, 10)]++;
        this.cart[index] = "0";
      } else {
        this.quantityArray[parseInt(product, 10)] = 1;
      }
    });
    this.quantityArray = this.quantityArray.filter((quantity) => quantity > 0);
    this.cart = this.cart.filter((id) => id !== "0");
  }

  ngOnInit() {
    this.loading = true;
    let promiseArray: Promise<Product>[] = [];
    this.cart.forEach((product) => {
      promiseArray.push(this.productsService.getProduct(parseInt(product, 10)));
    })
    Promise.all(promiseArray)
    .then((items) => {
      items.forEach((item, index) => {
        items[index]["quantity"] = this.quantityArray[index];
        this.total += item.price*item["quantity"];
      });

      this.items = items;
      this.loading = false;
    })
    .catch((err) => {
      console.log(err);
      this.loading = false;
    })
  }

  public add = (id: number) => {
    let indexToAdd = this.items.findIndex((item) => item.id === id)
    this.items[indexToAdd]['quantity']++;

    let storageCart: string[] = JSON.parse(localStorage.getItem("panier"));
    storageCart.push(id.toString())
    localStorage.setItem("panier", JSON.stringify(storageCart));
  }

  public remove = (id: number) => {
    let indexToDel = this.items.findIndex((item) => item.id === id)
    this.items[indexToDel]['quantity']--;

    let storageCart: string[] = JSON.parse(localStorage.getItem("panier"));
    indexToDel = storageCart.findIndex((item) => item === id.toString()) ;
    storageCart.splice(indexToDel, 1);
    localStorage.setItem("panier", JSON.stringify(storageCart));
  }

  public delete = (id: number) => {
    this.items = this.items.filter((item) => item.id !== id)
    let storageCart: string[] = JSON.parse(localStorage.getItem("panier"));
    storageCart.filter((product) => product !== id.toString())
    localStorage.setItem("panier", JSON.stringify(storageCart));
  }

  public deleteAll = () => {
    this.items = [];
    localStorage.setItem("panier", "[]");
  }

}
