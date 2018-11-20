import { Component, OnInit } from '@angular/core';
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
  submit() {
    if (!this.orderForm.valid()) {
      return;
    }
    // TODO: Compléter la soumission des informations lorsque le formulaire soumis est valide.
  }
}
