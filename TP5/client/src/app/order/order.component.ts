import { Component, OnInit } from '@angular/core';
import { Order, OrdersService } from 'app/orders.service';
import { ShoppingCartService } from 'app/shopping-cart.service';
import { Router } from '@angular/router';
declare const $: any;

/**
 * Defines the component responsible to manage the order page.
 */
@Component({
  selector: 'order',
  templateUrl: './order.component.html'
})
export class OrderComponent implements OnInit {

  orderForm: any;
  private order: Order;
  public firstName: string = "";
  public lastName: string = "";
  public email: string = "";
  public phone: string = "";

  constructor(public ordersService: OrdersService, public shoppingCartService: ShoppingCartService, private router:Router){}

  /**
   * Occurs when the component is initialized.
   */
  ngOnInit() {
    // Initializes the validation of the form. This is the ONLY place where jQuery usage is allowed.
    this.orderForm = $('#order-form');
    $.validator.addMethod('ccexp', function(value) {
      if (!value) {
        return false;
      }
      const regEx = /^(0?[1-9]|1[0-2])\/(0?[1-9]|[1-9][0-9])$/g;
      return regEx.test(value);
    }, 'La date d\'expiration de votre carte de crédit est invalide.');
    this.orderForm.validate({
      rules: {
        'phone': {
          required: true,
          phoneUS: true
        },
        'credit-card': {
          required: true,
          creditcard: true
        },
        'credit-card-expiry': {
          ccexp: true
        }
      }
    });
  }

  /**
   * Submits the order form.
   */
  async submit() {
    if (!this.orderForm.valid()) {
      return;
    }
    try{
      const id = await this.ordersService.getNewId();
      const products = await this.shoppingCartService.getCart();
      const productsToSend = products.map((product) => {
        return {id: product.productId,quantity: product.quantity}
      })
      this.order = {
        id,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        phone: this.phone,
        products: productsToSend,
      }
      const result = await this.ordersService.sendOrder(this.order);
      if(result){
        let cartsize = 0;
        products.forEach((product) => cartsize += product.quantity)
        this.shoppingCartService.deleteAllProducts(cartsize);
        this.router.navigate(['/confirmation']);
      }

    } catch(err){
      console.log(err)
    }
  }
}
