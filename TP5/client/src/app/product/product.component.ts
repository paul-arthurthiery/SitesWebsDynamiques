import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService, Product } from '../products.service'
import { ShoppingCartService } from '../shopping-cart.service'

/**
 * Defines the component responsible to manage the product page.
 */
@Component({
  selector: 'product',
  templateUrl: './product.component.html'
})
export class ProductComponent implements OnInit {

  /**
   * Initializes a new instance of the ProductComponent class.
   *
   * @param route                   The active route.
   */

  public product: Product;
  public loading: boolean;
  public quantity: string = "1";
  public showDialog: boolean = false;
  public cart: Array<{productId: number, quantity: number}>;

  constructor(private route: ActivatedRoute, public productsService: ProductsService, public shoppingCartService: ShoppingCartService) { }

  private refreshCart = async (): Promise<void> => {
    this.shoppingCartService.getCart()
    .then((cart) =>
      this.cart = cart.filter((item) => item.productId === this.product.id)
    )
    .catch((error) => {
      throw error;
    });
  }

  /**
   * Occurs when the component is initialized.
   */
  ngOnInit() {
    this.loading = true;
    const productId: string = this.route.snapshot.paramMap.get('id');
    this.productsService.getProduct(parseInt(productId, 10))
    .then((product) => {
      this.product = product;
      this.refreshCart()
      .then(() => {
        this.loading = false;
      })
      .catch((error) => {
        console.log(error);
        this.loading = false;
      });
    })
    .catch((error) => {
      console.log(error);
      this.loading = false;
    });

  }

  public addToCart = async () => {
    try{
      let numberQuantity: number = parseInt(this.quantity, 10);
      if(this.cart.length > 0){
        await this.shoppingCartService.updateQuantity(
          this.product.id,
          this.cart[0].quantity+numberQuantity,
          this.cart[0].quantity
        )
      } else {
        await this.shoppingCartService.addItem(this.product.id, numberQuantity);
      }
      await this.refreshCart();
      this.showDialog = true;
      setTimeout(() => {
        this.showDialog = false;
      }, 5000);
    } catch(err){
      console.log(err);
    }

  }

  public updateQuantity = (event) => {
    this.quantity = event.target.value;
  }
}
