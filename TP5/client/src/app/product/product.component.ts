import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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
  constructor(private route: ActivatedRoute) { }

  /**
   * Occurs when the component is initialized.
   */
  ngOnInit() {
    const productId = this.route.snapshot.paramMap.get('id');
    // TODO: Compléter la logique pour afficher le produit associé à l'identifiant spécifié (productId).
  }
}
