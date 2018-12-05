import { Component } from '@angular/core';
import { ProductsService, Product } from "../products.service";
import { ShoppingCartService } from "../shopping-cart.service";

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
  public cart: Array<{productId: number, quantity: number}>;
  public quantityArray: number[] = [];
  public total: number = 0;

  constructor(public productsService: ProductsService, public shoppingCartService: ShoppingCartService) {
  }

  ngOnInit() {
    this.loading = true;
    this.shoppingCartService.getCart()
    .then((cart) => {
      this.cart = cart;
      let promiseArray: Promise<Product>[] = [];
      this.cart.forEach((product) => {
        promiseArray.push(this.productsService.getProduct(product.productId));
      })
      Promise.all(promiseArray)
      .then((items) => {
        items.forEach((item, index) => {
          items[index]["quantity"] = this.cart[index].quantity;
          this.total += item.price*item["quantity"];
        });

        this.items = items;
        this.loading = false;
      })
      .catch((err) => {
        console.log(err);
        this.loading = false;
      })
    })
  }

  public add = async (id: number) => {
    const indexToAdd: number = this.items.findIndex((item) => item.id === id);
    const previousQuantity: number = this.items[indexToAdd]['quantity'];
    this.items[indexToAdd]['quantity']++;
    this.total += this.items[indexToAdd].price;

    try{
      await this.shoppingCartService.updateQuantity(id, this.items[indexToAdd]['quantity'], previousQuantity);
    } catch(err){
      console.log(err);
      this.items[indexToAdd]['quantity']--;
      this.total -= this.items[indexToAdd].price;
    }
  }

  public remove = async (id: number) => {
    const indexToDel: number = this.items.findIndex((item) => item.id === id);
    const previousQuantity: number = this.items[indexToDel]['quantity'];
    this.items[indexToDel]['quantity']--;
    this.total -= this.items[indexToDel].price;

    try{
      await this.shoppingCartService.updateQuantity(id, this.items[indexToDel]['quantity'], previousQuantity);
    } catch(err){
      this.items[indexToDel]['quantity']++;
      console.log(err);
      this.total += this.items[indexToDel].price;
    }
  }

  public delete = async (id: number) => {
    if(confirm("Deleting product")){
    try{
      const itemToDel = this.items.find((item) => item.id === id);
      await this.shoppingCartService.deleteProduct(id, 0, itemToDel["quantity"]);
      this.items = this.items.filter((item) => item.id !== id)
      console.log(this.items)
      this.total = 0;
      this.items.forEach((item, index) => {
        this.total += item.price*item["quantity"];
      });
    }catch(err){
      console.log(err)
    }
  }
  }

  public deleteAll = async () => {
    if(confirm("Deleting all products")){
    try{
      let cartsize:number = 0;
      this.items.forEach((product) => {
        cartsize += product["quantity"]
      })
      await this.shoppingCartService.deleteAllProducts(cartsize);
      this.items = [];
      this.total = 0;
    } catch(err) {
      console.log(err);
    }
  }
}

}
