import { Component } from '@angular/core';
import { OrdersService } from 'app/orders.service';

/**
* Defines the component responsible to manage the confirmation page.
*/
@Component({
  selector: 'confirmation',
  templateUrl: './confirmation.component.html'
})
export class ConfirmationComponent {
  orderInfo: { name: string; id: number; };

  constructor(public ordersService: OrdersService){
    this.orderInfo = this.ordersService.orderInfo;
  }

}
