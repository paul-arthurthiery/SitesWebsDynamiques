import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../products.service'

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

  public product;
  public loading: boolean;
  public quantity: string = "1";
  public showDialog: boolean = false;

  constructor(private route: ActivatedRoute, public productsService: ProductsService) { }

  /**
   * Occurs when the component is initialized.
   */
  ngOnInit() {
    this.loading = true;
    const productId = this.route.snapshot.paramMap.get('id');
    this.productsService.getProduct(parseInt(productId, 10))
    .then((product) => {
      this.product = product;
      this.loading = false;
    })
    .catch((error) => {
      console.log(error);
      this.loading = false;
    });
  }

  public addToCart = () => {
    let panier: string[] = JSON.parse(localStorage.getItem('panier'));
    for(let i=0; i<parseInt(this.quantity, 10); i++) {
      panier.push(this.product.id.toString())
    }
    localStorage.setItem('panier', JSON.stringify(panier));
    this.showDialog = true;
    setTimeout(() => {
      this.showDialog = false;
    }, 5000);
  }

  public updateQuantity = (event) => {
    this.quantity = event.target.value;
  }
}
