var onlineShop = onlineShop || {};

/**
 * Controls the "shopping cart" view and the elements associated with the shopping cart.
 *
 * @author Antoine Beland <antoine.beland@polymtl.ca>
 * @author Konstantinos Lambrou-Latreille <konstantinos.lambrou-latreille@polymtl.ca>
 */
(($, shoppingCartService, utils) => {
  "use strict";

  /**
   * Updates the shopping cart count to display.
   *
   * @private
   */
  function _updateCount() {
    shoppingCartService.getItemsCount().done(itemsCount => {
      const countElement = $(".shopping-cart").find(".count");
      if (itemsCount > 0) {
        countElement.addClass("visible").text(itemsCount);
      } else {
        countElement.removeClass("visible");
      }
    });
  }

  /**
   * Updates the total amount to display.
   *
   * @private
   */
  function _updateTotalAmount() {
    shoppingCartService.getTotalAmount().done(total => {
      $("#total-amount").html(utils.formatPrice(total));
    });
  }

  /**
   * Renders the view when the shopping cart is empty.
   *
   * @private
   */
  function _renderEmptyView() {
    $("#shopping-cart-container").html("<p>Aucun produit dans le panier.</p>");
  }

  // Initializes the "add to cart" form.
  $("#add-to-cart-form").submit(e => {
    e.preventDefault();
    const productId = +$(e.target).attr("data-product-id");
    shoppingCartService.addItem(productId, +$(e.target).find("input").val()).done(() => {
      const dialog = $("#dialog");
      dialog.fadeIn();
      setTimeout(() => dialog.fadeOut(), 5000);

      _updateCount();
      shoppingCartService.getItemQuantity(productId).done(quantity => $("#shopping-cart-quantity").text(quantity));
    });
  });

  // Initializes the shopping cart table.
  $(".shopping-cart-table > tbody >  tr").each(function() {
    const rowElement = $(this);
    const productId = +rowElement.attr("data-product-id");

    // Updates the quantity for a specific item and update the view.
    function updateQuantity(quantity) {
      rowElement.find(".remove-quantity-button").prop("disabled", quantity <= 1);
      shoppingCartService.updateItemQuantity(productId, quantity).done(() => {
		_updateCount();
		_updateTotalAmount();
	  });
      rowElement.find(".quantity").text(quantity);
      shoppingCartService.getItem(productId).done(item => {
        rowElement.find(".price").html(utils.formatPrice(item.product["price"] * quantity));
      });
    }

    rowElement.find(".remove-item-button").click(() => {
      if (confirm("Voulez-vous supprimer le produit du panier?")) {
        shoppingCartService.removeItem(productId);
        rowElement.remove();
        shoppingCartService.getItemsCount().done(itemsCount => {
          if (itemsCount === 0) {
            _renderEmptyView();
          } else {
            _updateTotalAmount();
          }
        });
        _updateCount();
      }
    });
    rowElement.find(".remove-quantity-button").click(() => {
      shoppingCartService.getItemQuantity(productId).done(quantity => {
        updateQuantity(quantity - 1);
      });
    });
    rowElement.find(".add-quantity-button").click(() => {
      shoppingCartService.getItemQuantity(productId).done(quantity => {
        updateQuantity(quantity + 1);
      });
    });
  });

  // Initializes the "remove all items" button.
  $("#remove-all-items-button").click(() => {
    if (confirm("Voulez-vous supprimer tous les produits du panier?")) {
      shoppingCartService.removeAllItems().done(() => {
		_renderEmptyView();
		_updateCount();   
	  });
    }
  });

})(jQuery, onlineShop.shoppingCartService, onlineShop.utils);
