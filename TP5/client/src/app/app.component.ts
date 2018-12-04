import { Component } from '@angular/core';
import { ShoppingCartService } from './shopping-cart.service'
import { Subject } from 'rxjs';

/**
 * Defines the main component of the application.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  public count: number = 0;
  public loading: boolean = true;
  private addToCount: Subject<number>;

  readonly authors = [
    'Paul-Arthur Thiéry',
    'Louis-Efflam Le Vély'
  ];

  constructor(public shoppingCartService: ShoppingCartService) {
    this.addToCount = this.shoppingCartService.getAddToCount();
    this.addToCount.subscribe({
      next: (quantity) => this.count += quantity
    })
  }

  ngOnInit(){
    this.shoppingCartService.getCart()
    .then((cart) => {
      cart.forEach((item) => {
        this.count += item.quantity;
      });
      this.loading = false;
    })
  }

}
